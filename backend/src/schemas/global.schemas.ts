import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import z from 'zod';

extendZodWithOpenApi(z);

export const IdSchema = z
    .int()
    .min(1, 'id cannot be negative!')
    .openapi({ description: 'Unique ID', example: 67 });

export const ResponseSchema = z
    .object({
        success: z
            .boolean()
            .openapi({ description: 'A boolean indicating whether the request was successful.' })
    })
    .openapi('Response');

export const SuccessResponseSchema = ResponseSchema.extend({
    success: z.literal(true).openapi({ example: true })
}).openapi('SuccessResponse');

export const CreatedResponseSchema = SuccessResponseSchema.extend({
    insertId: IdSchema.openapi({ description: 'Created ID', example: 67 })
}).openapi('CreatedResponse');

export const ErrorResponseSchema = ResponseSchema.extend({
    success: z.literal(false).openapi({ example: false }),
    errors: z.object({
        global: z.array(z.string()).openapi({ example: ['Request Error', 'Unauthorized Error'] })
    })
}).openapi('ErrorResponse');
