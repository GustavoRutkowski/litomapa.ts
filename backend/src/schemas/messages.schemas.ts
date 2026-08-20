import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { SuccessResponseSchema } from './global.schemas.js';

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
        author: MessageAuthorSchema,
        replying: ReplyingMessageSchema.nullable().openapi({ example: null })
    })
    .openapi('Message');

export const MessagesResponseSchema = SuccessResponseSchema.extend({
    data: z.array(MessageSchema)
}).openapi('MessagesResponse');
