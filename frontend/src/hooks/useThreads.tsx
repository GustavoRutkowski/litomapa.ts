import { useCallback } from 'react';
import {
    IThread,
    IThreadsQueryParams,
    getThread as getById,
    getThreads as getAll
} from '../services/threads.service';

export default function useThreads() {
    const getThreads = useCallback(
        async (params: IThreadsQueryParams = {}) => await getAll(params),
        []
    );
    const getThread = useCallback(async (id: number): Promise<IThread> => await getById(id), []);

    return { getThreads, getThread };
}
