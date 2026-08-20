import type Message from '../models/messages.model.js';
import MessageRepository from '../repositories/messages.repository.js';
import ThreadRepository from '../repositories/threads.repository.js';
import ApiError from '../utils/ApiError.js';

export default class MessageService {
    static async findAllByThreadId(threadId: number): Promise<Message[]> {
        if (!(await ThreadRepository.exists(threadId))) {
            throw new ApiError('Thread not found', 404);
        }

        return await MessageRepository.findAllByThreadId(threadId);
    }
}
