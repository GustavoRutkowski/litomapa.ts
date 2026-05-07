import { z } from 'zod';

const username = z.string().min(3, 'Username too short').max(20, 'Username too long');
const email = z.email('E-mail is invalid');

const password = z
    .string()
    .min(8, 'Password too short')
    .regex(/[a-z]/, 'Password must contain an lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain numbers')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain special characters');

export const createUserSchema = z.object({ username, email, password });
export const loginSchema = z.object({ email, password });
export const updateUserInfosSchema = z.object({ username, photo: z.base64() }).partial();

export const updateUserPasswordSchema = z.object({
    old_password: password,
    new_password: password,
    repeat_password: password
});
