import db from '../db/db.js';
import ApiError from '../utils/ApiError.js';
import Token from '../utils/Token.js';
import FileUploader from '../utils/FileUploader.js';
import { compare, hash } from 'bcrypt'
import IBase64File from '../types/IBase64File.js';
import Model from './Model.js';
import IUserDTO from '../types/users.types.js';

const HASH_SALTS = 10;

class User extends Model {
    protected static table = 'users';

    private static uploader = new FileUploader({
        path: 'backend/src/uploads',
        minsize: 0, maxsize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    });

    public static async login(email: string, password: string): Promise<string> {
        const query = 'SELECT * FROM users WHERE email = ?';
        const data = db.select<IUserDTO>(query, [email]);
        if (!data.rows || data.rows.length === 0)
            throw new ApiError('Invalid credentials', 401);

        const user = data.rows[0];
        const ok = user.password && await compare(password, user.password);
        if (!ok) throw new ApiError('Invalid credentials', 401);

        return Token.encode({ id: user.id, username: user.username, email: user.email });
    }

    public static async create(username: string, email: string, password: string): Promise<number> {
        if (this.userExists({ username, email }))
            throw new ApiError('User already exists', 400);

        const hashedPassword = await hash(password, HASH_SALTS);
        const cols = ['username', 'email', 'password'];
        return this.insert(cols, [username, email, hashedPassword]);
    }

    private static userExists({ id, username, email }: IUserDTO): boolean {
        const cols = [];
        const values = [];

        if (id) {
            cols.push('id = ?');
            values.push(id);
        }
        if (username) {
            cols.push('username = ?');
            values.push(username);
        }
        if (email) {
            cols.push('email = ?');
            values.push(email);
        }

        const query = 'SELECT username, email FROM users WHERE ' + cols.join(' OR ');
        const data = db.select<IUserDTO>(query, values);
        return !!data.rows && data.rows.length > 0;
    }

    public static get(token: string): IUserDTO {
        const id = this.authenticate(token);
        try {
            return this.selectById<IUserDTO>(id, ['id', 'username', 'email', 'photo']);
        } catch (e: any) {
            if (e instanceof ApiError && e.getStatus() === 404) throw new ApiError('User not found', 404);
            throw new ApiError('Failed to get user data', 500);
        }
    }

    public static changeUsername(token: string, newUsername: string): void {
        const id = this.authenticate(token);
        // Check if username is already taken by another user
        if (this.userExists({ username: newUsername }))
            throw new ApiError('Username already taken', 400);
        this.updateById(id, ['username'], [newUsername]);
    }

    public static async changePassword(token: string, newPassword: string): Promise<void> {
        const id = this.authenticate(token);
        const hashed = await hash(newPassword, HASH_SALTS);
        this.updateById(id, ['password'], [hashed]);
    }

    public static async changePhoto(token: string, file: IBase64File | null): Promise<void> {
        const id = this.authenticate(token);
        try {
            const userData = this.selectById<IUserDTO>(id, ['photo']);
            if (!userData.photo) throw new ApiError('No photo to update', 400);
            
            const prevPhoto = userData.photo;
            await this.uploader.remove(prevPhoto);
            
            if (file) {
                const newFilename = await this.uploader.upload(file);
                this.updateById(id, ['photo'], [newFilename]);
            }
        } catch (e: any) {
            if (e instanceof ApiError && e.getStatus() === 404) throw new ApiError('User not found', 404);
            throw new ApiError('Failed to change user photo', 500);
        }
    }

    public static async removePhoto(token: string): Promise<void> {
        try {
            await this.changePhoto(token, null);
        } catch(e: any) {
            if (e instanceof ApiError && e.getStatus() === 404) throw e;
            throw new ApiError('Failed to remove user photo', 500);
        }
    }

    public static async delete(token: string): Promise<void> {
        const id = this.authenticate(token);
        try {
            const userData = this.selectById<IUserDTO>(id, ['photo']);
            if (userData.photo) await this.uploader.remove(userData.photo);
        } catch(e: any) {
            if (e instanceof ApiError && e.getStatus() === 404) throw new ApiError('User not found', 404);
            throw new ApiError('Failed to delete user photo', 500);
        }
        this.deleteById(id);
    }
}

export default User;
