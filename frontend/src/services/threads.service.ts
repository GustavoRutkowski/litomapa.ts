import Api from '../utils/Api';

export interface IThreadAuthor {
    id: number;
    username: string;
    photo: string | null;
}

export interface IThreadTag {
    id: number;
    name: string;
}

export interface IThreadSpecie {
    id: number;
    name: string;
}

export interface IThread {
    id: number;
    title: string;
    latitude: number;
    longitude: number;
    author: IThreadAuthor;
    specie: IThreadSpecie;
    tags: IThreadTag[];
}

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
    data: IThread[];
}

interface IThreadResponse {
    data: IThread;
}

const api = new Api('/api/threads');

export async function getThreads(params: IThreadsQueryParams = {}): Promise<IThreadsResponse> {
    const query: Record<string, string | number | boolean> = {};

    if (params.offset !== undefined) query.offset = params.offset;
    if (params.limit !== undefined) query.limit = params.limit;
    if (params.tag) query.tag = params.tag;
    if (params.author) query.author = params.author;
    if (params.title) query.title = params.title;

    return await api.get<IThreadsResponse>('/', Object.keys(query).length > 0 ? { query } : null);
}

export async function getThread(id: number): Promise<IThread> {
    const response = await api.get<IThreadResponse>(`/${String(id)}`);
    return response.data;
}
