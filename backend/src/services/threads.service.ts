import type Thread from '../models/threads.model.js';
import type { ThreadVoteType } from '../models/threads.model.js';
import ThreadRepository, { ThreadFindAllQueryParams } from '../repositories/threads.repository.js';
import ApiError from '../utils/ApiError.js';

type FindAllResponse = {
    total: number;
    page: number;
    data: Thread[];
};

type CreateThreadData = {
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    species: number[];
    tags: number[];
    authorId: number;
};

export default class ThreadService {
    static async vote(threadId: number, userId: number, type: ThreadVoteType): Promise<void> {
        await this.ensureThreadExists(threadId);
        await ThreadRepository.upsertVote({ threadId, userId, type });
    }

    static async removeVote(threadId: number, userId: number): Promise<void> {
        await this.ensureThreadExists(threadId);
        await ThreadRepository.deleteVote(threadId, userId);
    }

    static async create(data: CreateThreadData): Promise<number> {
        return await ThreadRepository.insert({
            title: data.title,
            description: data.description,
            latitude: data.latitude,
            longitude: data.longitude,
            authorId: data.authorId,
            speciesIds: data.species,
            tagIds: data.tags
        });
    }

    static async findById(id: number): Promise<Thread> {
        const thread = await ThreadRepository.findById(id);
        if (!thread) throw new ApiError('Thread not found', 404);
        return thread;
    }

    private static async ensureThreadExists(id: number): Promise<void> {
        if (!(await ThreadRepository.exists(id))) {
            throw new ApiError('Thread not found', 404);
        }
    }

    static async findAll(params: ThreadFindAllQueryParams): Promise<FindAllResponse> {
        const [total, data] = await ThreadRepository.findAll(params);

        const OFFSET = Math.max(params.offset ?? 0, 0);
        const LIMIT = Math.max(params.limit ?? 10, 1);

        const page = params.limit ? Math.floor(OFFSET / LIMIT) + 1 : 1;
        return { total, page, data };
    }
}
