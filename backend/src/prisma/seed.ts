import { hash } from 'bcrypt';
import prisma from '../lib/prisma.js';

const disconnect = async () => await prisma.$disconnect();

const DEFAULT_PASSWORD = await hash('Password123!', 10);

const PLACEHOLDER_USERS = [
    {
        username: 'demo_user_one',
        email: 'demo.user.one@example.com',
        password: DEFAULT_PASSWORD
    },
    {
        username: 'demo_user_two',
        email: 'demo.user.two@example.com',
        password: DEFAULT_PASSWORD
    }
];

const PLACEHOLDER_SPECIES = ['Sea turtle', 'Capybara'];

const normalizeTagName = (value: string) => value.trim().toUpperCase();

const PLACEHOLDER_THREADS = [
    {
        title: 'Sea turtle spotted near mangrove',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['SIGHTING', 'Migration'],
        latitude: -30.0346,
        longitude: -51.2177
    },
    {
        title: 'Capybara sighting near riverbank',
        authorUsername: 'demo_user_two',
        speciesNames: ['Capybara'],
        tagNames: ['SIGHTING'],
        latitude: -31.7681,
        longitude: -52.3205
    },
    {
        title: 'Possible illegal fishing report near coast',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['REPORT'],
        latitude: -29.1658,
        longitude: -51.1794
    },
    {
        title: 'Invasive species observed on urban trail',
        authorUsername: 'demo_user_two',
        speciesNames: ['Capybara'],
        tagNames: ['INVASIVE_SPECIES', 'REPORT'],
        latitude: -29.1627,
        longitude: -51.1767
    },
    {
        title: 'Migration corridor update for sea turtles',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['MIGRATION'],
        latitude: -29.684,
        longitude: -53.8069
    },
    {
        title: 'Capybara movement reported after rain',
        authorUsername: 'demo_user_two',
        speciesNames: ['Capybara'],
        tagNames: ['REPORT', 'MIGRATION'],
        latitude: -27.4689,
        longitude: -52.2724
    }
];

export default async function seed() {
    try {
        const FIXED_USER_ROLE = {
            id: 1,
            name: 'USER'
        };

        const FIXED_TAGS = ['SIGHTING', 'REPORT', 'INVASIVE_SPECIES', 'MIGRATION'];

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

        // Placeholders (Users | Species | Threads)

        const users: Array<{ id: number; username: string }> = [];

        for (const userData of PLACEHOLDER_USERS) {
            const user = await prisma.user.upsert({
                where: { username: userData.username },
                update: {
                    email: userData.email,
                    password: DEFAULT_PASSWORD,
                    roleId: FIXED_USER_ROLE.id
                },
                create: {
                    username: userData.username,
                    email: userData.email,
                    password: DEFAULT_PASSWORD,
                    roleId: FIXED_USER_ROLE.id
                }
            });

            users.push({ id: user.id, username: user.username });
        }

        for (const name of PLACEHOLDER_SPECIES) {
            await prisma.species.upsert({
                where: { name },
                update: {},
                create: { name }
            });
        }

        for (const threadData of PLACEHOLDER_THREADS) {
            const existingThread = await prisma.thread.findFirst({
                where: { title: threadData.title }
            });

            const author = users.find(user => user.username === threadData.authorUsername);
            if (!author) continue;

            const normalizedTagNames = threadData.tagNames.map(normalizeTagName);

            for (const tagName of normalizedTagNames) {
                await prisma.tag.upsert({
                    where: { name: tagName },
                    update: {},
                    create: { name: tagName }
                });
            }

            if (existingThread) {
                await prisma.thread.update({
                    where: { id: existingThread.id },
                    data: {
                        latitude: threadData.latitude,
                        longitude: threadData.longitude
                    }
                });
                continue;
            }

            await prisma.thread.create({
                data: {
                    title: threadData.title,
                    latitude: threadData.latitude,
                    longitude: threadData.longitude,
                    authorId: author.id,
                    threadTags: {
                        create: normalizedTagNames.map(tagName => ({
                            tag: { connect: { name: tagName } }
                        }))
                    },
                    threadSpecies: {
                        create: threadData.speciesNames.map(speciesName => ({
                            species: { connect: { name: speciesName } }
                        }))
                    }
                }
            });
        }
    } catch (e) {
        console.error('Seed error:', e);
        process.exit(1);
    } finally {
        await disconnect();
    }
}
