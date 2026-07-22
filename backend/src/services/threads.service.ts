import type Thread from '../models/threads.model.js';
import ThreadRepository, { ThreadFindAllQueryParams } from '../repositories/threads.repository.js';
import ApiError from '../utils/ApiError.js';

type FindAllResponse = {
    total: number;
    page: number;
    data: Thread[];
};

export default class ThreadService {
    static async findById(id: number): Promise<Thread> {
        const thread = await ThreadRepository.findById(id);
        if (!thread) throw new ApiError('Thread not found', 404);
        return thread;
    }

    static async findAll(params: ThreadFindAllQueryParams): Promise<FindAllResponse> {
        const [total, data] = await ThreadRepository.findAll(params);

        const OFFSET = Math.max(params.offset ?? 0, 0);
        const LIMIT = Math.max(params.limit ?? 10, 1);

        const page = params.limit ? Math.floor(OFFSET / LIMIT) + 1 : 1;
        return { total, page, data };
    }
}
