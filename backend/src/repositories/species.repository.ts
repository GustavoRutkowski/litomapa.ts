import prisma from '../lib/prisma.js';
import type Specie from '../models/species.model.js';

type SpeciesFindAllQueryParams = {
    search?: string;
};

export default class SpeciesRepository {
    static async findAll(params: SpeciesFindAllQueryParams = {}): Promise<Specie[]> {
        const search = params.search?.trim();

        const species = await prisma.species.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                scientificName: true,
                group: true
            }
        });

        const items = species.map(item => ({
            id: item.id,
            name: item.name,
            scientific_name: item.scientificName,
            group: item.group
        }));

        if (!search) return items;

        const needle = search.toLowerCase();

        return items.filter(item => {
            const haystack = [item.name, item.scientific_name, item.group].join(' ').toLowerCase();

            return haystack.includes(needle);
        });
    }
}

export { SpeciesFindAllQueryParams };
