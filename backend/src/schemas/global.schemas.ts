import z from 'zod';

export const idSchema = z.int().min(1, 'id cannot be negative!');
