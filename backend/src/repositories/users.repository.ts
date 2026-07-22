import User from '../models/users.model.js';
import prisma from '../lib/prisma.js';

type UserCredentials = Pick<User, 'email' | 'password'>;

export default class UserRepository {
    static async findById(id: number): Promise<Omit<User, 'password'> | null> {
        return await prisma.user.findUnique({
            omit: { password: true },
            where: { id }
        });
    }

    static async findByName(username: string): Promise<Pick<User, 'username'> | null> {
        return await prisma.user.findUnique({
            select: { username: true },
            where: { username }
        });
    }

    static async findByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    static async findCredentialsById(id: number): Promise<UserCredentials | null> {
        return await prisma.user.findUnique({
            select: {
                email: true,
                password: true
            },
            where: { id }
        });
    }

    static async insert(data: Omit<User, 'id' | 'photo'>): Promise<number> {
        const res = await prisma.user.create({ data });
        return res.id;
    }

    static async update(id: number, data: Partial<User>): Promise<void> {
        await prisma.user.update({ where: { id }, data });
    }
}
