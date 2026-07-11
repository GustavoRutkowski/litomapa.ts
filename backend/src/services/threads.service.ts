import type Thread from '../models/threads.model.js';
import ThreadRepository, { ThreadFindAllParams } from '../repositories/threads.repository.js';

type FindAllResponse = {
    total: number;
    page: number;
    data: Thread[];
};

export default class ThreadService {
    static async findAll(params: ThreadFindAllParams): Promise<FindAllResponse> {
        const OFFSET = Math.max(params.offset ?? 0, 0);
        const LIMIT = Math.max(params.limit ?? 10, 1);

        const [total, data] = await ThreadRepository.findAll({
            ...params,
            offset: OFFSET,
            limit: LIMIT
        });

        const page = Math.floor(OFFSET / LIMIT) + 1;
        return { total, page, data };
    }
}
