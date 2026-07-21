import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { ResponseSchema } from './global.schemas.js';

extendZodWithOpenApi(z);

const ThreadTagSchema = z
    .object({
        id: z.number().int().positive().openapi({ example: 1 }),
        name: z.string().openapi({ example: 'Sighting' })
    })
    .openapi('ThreadTag');

const ThreadAuthorSchema = z
    .object({
        id: z.number().int().positive().openapi({ example: 10 }),
        name: z.string().openapi({ example: 'demo_user_one' }),
        photo: z.string().nullable().openapi({ example: null })
    })
    .openapi('ThreadAuthor');

const ThreadSpecieSchema = z
    .object({
        id: z.number().int().positive().openapi({ example: 2 }),
        name: z.string().openapi({ example: 'Sea turtle' })
    })
    .openapi('ThreadSpecie');

export const ThreadListItemSchema = z
    .object({
        id: z.number().int().positive().openapi({ example: 12 }),
        title: z.string().openapi({ example: 'Sea turtle spotted near mangrove' }),
        latitude: z.number().min(-90).max(90).openapi({ example: -15.7801 }),
        longitude: z.number().min(-180).max(180).openapi({ example: -47.9292 }),
        tags: z.array(ThreadTagSchema).openapi({ example: [{ id: 1, name: 'Sighting' }] }),
        author: ThreadAuthorSchema,
        specie: ThreadSpecieSchema
    })
    .openapi('ThreadListItem');

export const ThreadIdSchema = z.coerce.number().int().positive().openapi({
    description: 'Thread ID',
    example: 12
});

export const ThreadsQuerySchema = z
    .object({
        offset: z.coerce.number().int().min(0).optional().default(0),
        limit: z.coerce.number().int().min(1).max(50).optional().default(10),
        tag: z.string().trim().optional(),
        author: z.string().trim().optional(),
        title: z.string().trim().optional()
    })
    .openapi('ThreadsQuery');

export const ThreadsResponseSchema = ResponseSchema.extend({
    total: z.number().int().min(0).openapi({ example: 6 }),
    page: z.number().int().min(1).openapi({ example: 1 }),
    data: z.array(ThreadListItemSchema)
}).openapi('ThreadsResponse');
