import { SpeciesGroup } from '@prisma/client';
import prisma from '../../lib/prisma.js';
import SPECIES_MOCK from '../mocks/species-mock.json' with { type: 'json' };

const disconnect = async () => await prisma.$disconnect();

export default async function seed() {
    try {
        for (const species of SPECIES_MOCK) {
            await prisma.species.upsert({
                where: { name: species.name },
                update: {
                    scientificName: species.cientific_name,
                    group: species.group as SpeciesGroup
                },
                create: {
                    id: species.id,
                    name: species.name,
                    scientificName: species.cientific_name,
                    group: species.group as SpeciesGroup
                }
            });
        }
    } catch (e) {
        console.error('Mock seed error:', e);
        process.exitCode = 1;
    } finally {
        await disconnect();
    }
}

await seed();
