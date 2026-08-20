import prisma from '../lib/prisma.js';
import type Message from '../models/messages.model.js';

type UnformattedMessage = {
    id: number;
    threadId: number;
    content: string;
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
    author: message.author,
    replying: message.replyingTo
});

export default class MessageRepository {
    static async findAllByThreadId(threadId: number): Promise<Message[]> {
        const messages = await prisma.message.findMany({
            where: { threadId },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                threadId: true,
                content: true,
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
