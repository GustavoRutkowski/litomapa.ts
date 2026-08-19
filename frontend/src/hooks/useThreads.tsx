import { useCallback } from 'react';
import useAuth from './useAuth';
import {
    ThreadDTO,
    IThreadsQueryParams,
    getThread as getById,
    getThreads as getAll,
    removeThreadVote,
    ThreadVoteType,
    voteThread
} from '../services/threads.service';

export default function useThreads() {
    const { token } = useAuth();

    const getThreads = useCallback(
        async (params: IThreadsQueryParams = {}) => await getAll(params, token),
        [token]
    );
    const getThread = useCallback(
        async (id: number): Promise<ThreadDTO> => await getById(id, token),
        [token]
    );
    const vote = useCallback(
        async (id: number, type: ThreadVoteType) => await voteThread(id, type, token),
        [token]
    );
    const removeVote = useCallback(
        async (id: number) => await removeThreadVote(id, token),
        [token]
    );

    return { getThreads, getThread, vote, removeVote };
}
