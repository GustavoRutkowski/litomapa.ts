import prisma from '../lib/prisma.js';
import type Message from '../models/messages.model.js';

type InsertMessageData = {
    threadId: number;
    authorId: number;
    content: string;
    replyId?: number;
    attachments?: string[];
};

type UnformattedMessage = {
    id: number;
    threadId: number;
    content: string;
    createdAt: Date;
    attachments: { path: string }[];
    author: {
        id: number;
        username: string;
        photo: string | null;
    };
    replyingTo: {
        id: number;
        content: string;
        author: {
            id: number;
            username: string;
            photo: string | null;
        };
    } | null;
};

const formatMessage = (message: UnformattedMessage): Message => ({
    id: message.id,
    threadId: message.threadId,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    attachments: message.attachments.map(({ path }) => `uploads/attachments/${path}`),
    author: message.author,
    replying: message.replyingTo
});

export default class MessageRepository {
    static async existsInThread(id: number, threadId: number): Promise<boolean> {
        const message = await prisma.message.findFirst({
            where: { id, threadId },
            select: { id: true }
        });

        return message !== null;
    }

    static async insert({
        threadId,
        authorId,
        content,
        replyId,
        attachments = []
    }: InsertMessageData): Promise<number> {
        const message = await prisma.message.create({
            data: {
                threadId,
                authorId,
                content,
                ...(replyId === undefined ? {} : { replyingId: replyId }),
                attachments: {
                    create: attachments.map(path => ({ path }))
                }
            },
            select: { id: true }
        });

        return message.id;
    }

    static async findAllByThreadId(threadId: number): Promise<Message[]> {
        const messages = await prisma.message.findMany({
            where: { threadId },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                threadId: true,
                content: true,
                createdAt: true,
                attachments: {
                    select: { path: true }
                },
                author: {
                    select: {
                        id: true,
                        username: true,
                        photo: true
                    }
                },
                replyingTo: {
                    select: {
                        id: true,
                        content: true,
                        author: {
                            select: {
                                id: true,
                                username: true,
                                photo: true
                            }
                        }
                    }
                }
            }
        });

        return messages.map(formatMessage);
    }
}
