import { compare, hash } from 'bcrypt';
import User from '../models/users.model.js';
import UserRepository from '../repositories/user.repository.js';
import ApiError from '../utils/ApiError.js';
import Token from '../utils/Token.js';
import FileUploader from '../utils/FileUploader.js';

const SALTS = 10;

type ChangePasswordBody = {
    old_password: string;
    new_password: string;
    repeat_password: string;
};

const USER_NOT_FOUND_ERR = new ApiError('User not found', 404);

export default class UserService {
    private static uploader = new FileUploader({
        path: 'backend/src/uploads',
        minsize: 0,
        maxsize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    });

    static async create(data: Omit<User, 'id' | 'photo'>): Promise<number> {
        const user = await UserRepository.findByEmail(data.email);
        if (user) throw new ApiError('E-mail already exists', 409);

        const password = await hash(data.password, SALTS);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...rest } = data;
        return await UserRepository.insert({
            password,
            ...rest
        });
    }

    static async login(data: Pick<User, 'email' | 'password'>): Promise<string> {
        const error = new ApiError('Login failed!', 401);

        const user = await UserRepository.findByEmail(data.email);
        if (!user) throw error;

        const ok = await compare(data.password, user.password);
        if (!ok) throw error;

        const { id, username, email } = user;
        return Token.encode({ id, username, email });
    }

    static async get(id: number): Promise<Omit<User, 'password'>> {
        const user = await UserRepository.findById(id);
        if (!user) throw USER_NOT_FOUND_ERR;
        return user;
    }

    static async changeInfos(id: number, data: Partial<User>) {
        const user = await UserRepository.findById(id);
        if (!user) throw USER_NOT_FOUND_ERR;

        const fields: string[] = [];
        const values: (string | null)[] = [];

        let hasPhoto: boolean = false;
        let filename: string | null = null;

        if (data.username && data.username !== user.username) {
            const user = await UserRepository.findByName(data.username);
            if (user) throw new ApiError('This username is already in use', 409);
            fields.push('username');
            values.push(data.username);
        }

        // Remove photo if null
        if (data.photo === null) {
            fields.push('photo');
            values.push(null);
        }

        if (data.photo && data.photo !== user.photo) {
            hasPhoto = true;
            filename = await this.uploader.upload(data.photo);
            fields.push('photo');
            values.push(filename);
        }

        const map = (key: string, i: number) => [key, values[i]];
        const updated = Object.fromEntries(fields.map(map));

        try {
            await UserRepository.update(id, updated);
            if (hasPhoto && user.photo) this.uploader.remove(user.photo);
        } catch {
            if (filename) this.uploader.remove(filename);
            throw new ApiError('Failed to update', 500);
        }
    }

    static async changePassword(id: number, data: ChangePasswordBody) {
        const user = await UserRepository.findCredentialsById(id);
        if (!user) throw USER_NOT_FOUND_ERR;

        const match = await compare(data.old_password, user.password);
        if (!match) throw new ApiError('Old password is wrong!', 422);

        if (data.new_password !== data.repeat_password)
            throw new ApiError('Passwords do not match!', 422);

        const password = await hash(data.new_password, SALTS);

        try {
            await UserRepository.update(id, { password });
        } catch {
            throw new ApiError('Failed to change password', 500);
        }
    }
}
