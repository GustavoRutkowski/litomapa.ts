import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import {
    CreatedResponseSchema,
    IdSchema,
    ResponseSchema,
    SuccessResponseSchema
} from './global.schemas.js';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Request Schemas

const UserSchema = z
    .object({
        id: IdSchema.openapi({ description: 'User ID', example: 67 }),
        username: z
            .string()
            .min(3, 'Username too short')
            .max(20, 'Username too long')
            .openapi({ example: 'joao_silva' }),
        email: z.email('E-mail format is invalid').openapi({ example: 'joao_silva@example.com' }),
        password: z
            .string()
            .min(8, 'Password too short')
            .regex(/[a-z]/, 'Password must contain an lowercase letter')
            .regex(/[A-Z]/, 'Password must contain an uppercase letter')
            .regex(/[0-9]/, 'Password must contain numbers')
            .regex(/[^a-zA-Z0-9]/, 'Password must contain special characters')
            .openapi({ example: 'StrongPassword1234!' }),
        photo: z
            .string()
            .regex(
                /^([a-zA-Z0-9_-]+|\.)(\/[a-zA-Z0-9_-]+)*\.[a-zA-Z0-9]{2,4}$/,
                'Invalid image path format'
            )
    })
    .openapi('User');

export const CreateUserSchema = UserSchema.pick({
    username: true,
    email: true,
    password: true
}).openapi('CreateUser');
export const LoginSchema = UserSchema.pick({ email: true, password: true }).openapi('Login');
export const UpdateUserInfosSchema = UserSchema.pick({ username: true })
    .extend({
        photo: z.base64().openapi({ description: 'Base64 representing the path of the photo' })
    })
    .partial()
    .openapi('UpdateUserInfos');

export const UpdateUserPasswordSchema = z
    .object({
        old_password: UserSchema.shape.password,
        new_password: UserSchema.shape.password,
        repeat_password: UserSchema.shape.password
    })
    .refine(data => data.new_password === data.repeat_password, {
        message: 'Passwords do not match',
        path: ['repeat_password']
    })
    .openapi('UpdateUserPassword');

// Response Schemas

export const UserResponseSchema = ResponseSchema.extend({
    data: UserSchema.omit({ password: true }).openapi({
        description: 'Returns the requested user',
        example: {
            id: 67,
            username: 'joao_silva',
            email: 'joao_silva@example.com',
            photo: 'uploads/photo_avatar_1.jpeg'
        }
    })
}).openapi('UserResponse');

export const CreateUserResponseSchema = CreatedResponseSchema.openapi('CreateUserResponse');

export const LoginResponseSchema = SuccessResponseSchema.extend({
    token: z.jwt().openapi({
        description: 'JWT Token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5.eyJzdWIiOiIxMjM0NTY3ODk.TJVA95OrM7E2cBab30RMHrHD'
    })
}).openapi('LoginResponse');

export const UpdateUserInfosResponseSchema =
    SuccessResponseSchema.openapi('UpdateUserInfosResponse');
export const UpdateUserPasswordResponseSchema = SuccessResponseSchema.openapi(
    'UpdateUserPasswordResponse'
);
