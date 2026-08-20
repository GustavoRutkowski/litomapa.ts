import type Message from '../models/messages.model.js';
import MessageRepository from '../repositories/messages.repository.js';
import ThreadRepository from '../repositories/threads.repository.js';
import ApiError from '../utils/ApiError.js';

type CreateMessageData = {
    threadId: number;
    authorId: number;
    content: string;
    replyId?: number;
};

export default class MessageService {
    static async create({ threadId, authorId, content, replyId }: CreateMessageData) {
        if (!(await ThreadRepository.exists(threadId))) {
            throw new ApiError('Thread not found', 404);
        }

        if (replyId !== undefined && !(await MessageRepository.existsInThread(replyId, threadId))) {
            throw new ApiError('Message to reply not found', 404);
        }

        return await MessageRepository.insert({ threadId, authorId, content, replyId });
    }

    static async findAllByThreadId(threadId: number): Promise<Message[]> {
        if (!(await ThreadRepository.exists(threadId))) {
            throw new ApiError('Thread not found', 404);
        }

        return await MessageRepository.findAllByThreadId(threadId);
    }
}
