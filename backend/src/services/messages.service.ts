import type Message from '../models/messages.model.js';
import MessageRepository from '../repositories/messages.repository.js';
import ThreadRepository from '../repositories/threads.repository.js';
import ApiError from '../utils/ApiError.js';
import FileUploader from '../utils/FileUploader.js';

type CreateMessageData = {
    threadId: number;
    authorId: number;
    content: string;
    replyId?: number;
    attachments: string[];
};

export default class MessageService {
    private static uploader = new FileUploader({
        path: 'backend/uploads/attachments',
        minsize: 0,
        maxsize: 5 * 1024 * 1024, // 5 MB
        allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
    });

    static async create({ threadId, authorId, content, replyId, attachments }: CreateMessageData) {
        if (!(await ThreadRepository.exists(threadId))) {
            throw new ApiError('Thread not found', 404);
        }

        if (replyId !== undefined && !(await MessageRepository.existsInThread(replyId, threadId))) {
            throw new ApiError('Message to reply not found', 404);
        }

        const uploadedFiles: string[] = [];

        try {
            for (const attachment of attachments) {
                uploadedFiles.push(await this.uploader.upload(attachment));
            }

            return await MessageRepository.insert({
                threadId,
                authorId,
                content,
                replyId,
                attachments: uploadedFiles
            });
        } catch (e) {
            await Promise.all(uploadedFiles.map(filename => this.uploader.remove(filename)));
            throw e;
        }
    }

    static async findAllByThreadId(threadId: number): Promise<Message[]> {
        if (!(await ThreadRepository.exists(threadId))) {
            throw new ApiError('Thread not found', 404);
        }

        return await MessageRepository.findAllByThreadId(threadId);
    }
}
