import { useCallback } from 'react';
import {
    ThreadDTO,
    IThreadsQueryParams,
    getThread as getById,
    getThreads as getAll
} from '../services/threads.service';

export default function useThreads() {
    const getThreads = useCallback(
        async (params: IThreadsQueryParams = {}) => await getAll(params),
        []
    );
    const getThread = useCallback(async (id: number): Promise<ThreadDTO> => await getById(id), []);

    return { getThreads, getThread };
}
