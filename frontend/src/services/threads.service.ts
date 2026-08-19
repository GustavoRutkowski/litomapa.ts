import Api from '../utils/Api';

export interface IThreadAuthor {
    id: number;
    username: string;
    photo: string | null;
}

export interface IThreadSpecie {
    id: number;
    name: string;
}

export interface ThreadDTO {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    coords: {
        latitude: number;
        longitude: number;
    };
    author: IThreadAuthor;
    species: IThreadSpecie[];
    tags: string[];
    upvotes: number;
    my_vote: ThreadVoteType | null;
}

export type ThreadVoteType = 'upvote' | 'downvote';

export interface IThreadsQueryParams {
    offset?: number;
    limit?: number;
    tag?: string;
    author?: string;
    title?: string;
}

interface IThreadsResponse {
    total: number;
    page: number;
    data: ThreadDTO[];
}

interface IThreadResponse {
    data: ThreadDTO;
}

const api = new Api('/api/threads');

export async function getThreads(
    params: IThreadsQueryParams = {},
    token: string | null = null
): Promise<IThreadsResponse> {
    const query: Record<string, string | number | boolean> = {};

    if (params.offset !== undefined) query.offset = params.offset;
    if (params.limit !== undefined) query.limit = params.limit;
    if (params.tag) query.tag = params.tag;
    if (params.author) query.author = params.author;
    if (params.title) query.title = params.title;

    return await api.get<IThreadsResponse>('/', {
        ...(Object.keys(query).length > 0 ? { query } : {}),
        headers: new Headers(token ? { Authorization: `Bearer ${token}` } : undefined)
    });
}

export async function getThread(id: number, token: string | null = null): Promise<ThreadDTO> {
    const response = await api.get<IThreadResponse>(`/${String(id)}`, {
        headers: new Headers(token ? { Authorization: `Bearer ${token}` } : undefined)
    });
    return response.data;
}

export async function voteThread(
    id: number,
    type: ThreadVoteType,
    token: string | null
): Promise<void> {
    await api.put(`/${String(id)}/vote`, {
        headers: new Headers(token ? { Authorization: `Bearer ${token}` } : undefined),
        body: { type }
    });
}

export async function removeThreadVote(id: number, token: string | null): Promise<void> {
    await api.delete(`/${String(id)}/vote`, {
        headers: new Headers(token ? { Authorization: `Bearer ${token}` } : undefined)
    });
}
