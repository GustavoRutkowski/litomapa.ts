import Api from '../utils/Api';

export interface ISpeciesDTO {
    id: number;
    name: string;
    scientific_name: string;
    group: string;
}

const api = new Api('/api/species');

export async function getSpecies(search?: string): Promise<ISpeciesDTO[]> {
    const response = await api.get<{ success: boolean; data: ISpeciesDTO[] }>('/', {
        query: search ? { search } : undefined
    });
    return response.data;
}
