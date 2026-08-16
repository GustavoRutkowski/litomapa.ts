import Api from '../utils/Api';

export interface ITagDTO {
    id: number;
    name: string;
}

const api = new Api('/api/tags');

export async function getTags(): Promise<ITagDTO[]> {
    const response = await api.get<{ success: boolean; data: ITagDTO[] }>('/');
    return response.data;
}
