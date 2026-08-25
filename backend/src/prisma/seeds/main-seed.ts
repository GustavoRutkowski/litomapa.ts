import prisma from '../../lib/prisma.js';

const disconnect = async () => await prisma.$disconnect();

export default async function seed() {
    const FIXED_USER_ROLE = {
        id: 1,
        name: 'USER'
    };

    const FIXED_TAGS = ['SIGHTING', 'REPORT', 'INVASIVE_SPECIES', 'MIGRATION'];

    try {
        await prisma.role.upsert({
            where: { name: FIXED_USER_ROLE.name },
            update: {},
            create: FIXED_USER_ROLE
        });

        for (const name of FIXED_TAGS) {
            await prisma.tag.upsert({
                where: { name },
                update: {},
                create: { name }
            });
        }
    } catch (e) {
        console.error('Main seed error:', e);
        process.exitCode = 1;
    } finally {
        await disconnect();
    }
}

await seed();
