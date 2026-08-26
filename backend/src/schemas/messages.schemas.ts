import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { CreatedResponseSchema, SuccessResponseSchema } from './global.schemas.js';

extendZodWithOpenApi(z);

const MessageAuthorSchema = z
    .object({
        id: z.number().int().positive().openapi({ example: 1 }),
        username: z.string().openapi({ example: 'Hex' }),
        photo: z.string().nullable().openapi({ example: null })
    })
    .openapi('MessageAuthor');

const ReplyingMessageSchema = z
    .object({
        id: z.number().int().positive().openapi({ example: 2 }),
        content: z.string().openapi({ example: 'Mensagem a ser respondida...' }),
        author: MessageAuthorSchema
    })
    .openapi('ReplyingMessage');

export const MessageSchema = z
    .object({
        id: z.number().int().positive().openapi({ example: 1 }),
        threadId: z.number().int().positive().openapi({ example: 1 }),
        content: z.string().openapi({ example: 'Minha mensagem...' }),
        attachments: z.array(z.string()).openapi({ example: ['uploads/attachments/image.jpg'] }),
        author: MessageAuthorSchema,
        replying: ReplyingMessageSchema.nullable().openapi({ example: null })
    })
    .openapi('Message');

export const MessagesResponseSchema = SuccessResponseSchema.extend({
    data: z.array(MessageSchema)
}).openapi('MessagesResponse');

export const CreateMessageSchema = z
    .object({
        content: z.string().trim().min(1).max(10000).openapi({ example: 'Minha mensagem...' }),
        replyId: z.number().int().positive().optional().openapi({ example: 2 }),
        attachments: z
            .array(z.string())
            .default([])
            .openapi({
                example: ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD']
            })
    })
    .openapi('CreateMessage');

export const CreateMessageResponseSchema = CreatedResponseSchema.openapi('CreateMessageResponse');
