import type Thread from '../models/threads.model.js';
import type { ThreadVoteType } from '../models/threads.model.js';
import ThreadRepository, {
    ThreadFindAllQueryParams,
    ThreadRepositoryResult
} from '../repositories/threads.repository.js';
import ApiError from '../utils/ApiError.js';
import calculateRelevance from '../utils/threadRelevance.js';

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

const removeRelevance = (thread: ThreadRepositoryResult): Thread => {
    const formattedThread = { ...thread } as Thread & {
        relevance?: ThreadRepositoryResult['relevance'];
    };
    delete formattedThread.relevance;
    return formattedThread;
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

    static async findById(id: number, userId?: number): Promise<Thread> {
        const thread = await ThreadRepository.findById(id, userId);
        if (!thread) throw new ApiError('Thread not found', 404);
        return removeRelevance(thread);
    }

    private static async ensureThreadExists(id: number): Promise<void> {
        if (!(await ThreadRepository.exists(id))) {
            throw new ApiError('Thread not found', 404);
        }
    }

    static async findAll(
        params: ThreadFindAllQueryParams,
        userId?: number
    ): Promise<FindAllResponse> {
        const [total, threads] = await ThreadRepository.findAll(params, userId);

        const sortedThreads = threads.sort((firstThread, secondThread) => {
            const firstRelevance = calculateRelevance(
                firstThread.relevance.createdAt,
                firstThread.upvotes,
                firstThread.relevance.messages
            );
            const secondRelevance = calculateRelevance(
                secondThread.relevance.createdAt,
                secondThread.upvotes,
                secondThread.relevance.messages
            );

            return secondRelevance - firstRelevance;
        });

        const OFFSET = Math.max(params.offset ?? 0, 0);
        const LIMIT = Math.max(params.limit ?? 10, 1);

        const page = params.limit ? Math.floor(OFFSET / LIMIT) + 1 : 1;
        const data = sortedThreads.slice(OFFSET, OFFSET + LIMIT).map(removeRelevance);

        return { total, page, data };
    }
}
