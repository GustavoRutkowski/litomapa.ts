import prisma from '../lib/prisma.js';

const disconnect = async () => await prisma.$disconnect();

export default async function seed() {
    // USER role auto-insert
    await prisma.role
        .upsert({
            where: { id: 1 },
            update: {},
            create: { id: 1, name: 'USER' }
        })
        .catch(e => {
            console.error('Seed error:', e);
            process.exit(1);
        })
        .finally(disconnect);
}
