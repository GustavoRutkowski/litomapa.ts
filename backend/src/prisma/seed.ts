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

const PLACEHOLDER_SPECIES = [
    {
        name: 'Tartaruga-marinha',
        scientificName: 'Chelonia mydas',
        group: 'turtle'
    },
    {
        name: 'Golfinho-comum',
        scientificName: 'Delphinus delphis',
        group: 'dolphin'
    },
    {
        name: 'Atum',
        scientificName: 'Thunnus thynnus',
        group: 'fish'
    },
    {
        name: 'Tubarão-baleia',
        scientificName: 'Rhincodon typus',
        group: 'shark'
    }
] as const;

const normalizeTagName = (value: string) => value.trim().toUpperCase();

const PLACEHOLDER_THREADS = [
    {
        title: 'Tartaruga-marinha vista perto do manguezal',
        description:
            'Observamos uma tartaruga-marinha adulta próxima à entrada do manguezal por volta das 08:30. O animal apareceu saudável e seguiu para águas mais profundas.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Tartaruga-marinha'],
        tagNames: ['SIGHTING', 'Migration'],
        latitude: -30.0346,
        longitude: -51.2177
    },
    {
        title: 'Grupo de golfinhos próximo à costa',
        description:
            'Um grupo de golfinhos foi observado em atividade na costa durante a manhã. O comportamento parecia social e não havia sinais de estresse.',
        authorUsername: 'demo_user_two',
        speciesNames: ['Golfinho-comum'],
        tagNames: ['SIGHTING'],
        latitude: -31.7681,
        longitude: -52.3205
    },
    {
        title: 'Possível atividade de pesca irregular',
        description:
            'Rede de pesca foi localizada em área restrita e permaneceu abandonada por várias horas.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Tartaruga-marinha'],
        tagNames: ['REPORT'],
        latitude: -29.1658,
        longitude: -51.1794
    },
    {
        title: 'Movimentação de peixes na entrada do canal',
        description:
            'Bandos pequenos de peixes foram observados cruzando a entrada do canal durante a maré baixa.',
        authorUsername: 'demo_user_two',
        speciesNames: ['Atum'],
        tagNames: ['REPORT', 'MIGRATION'],
        latitude: -29.1627,
        longitude: -51.1767
    },
    {
        title: 'Corredor de migração em atualização',
        description:
            'Tartarugas continuam usando o corredor esperado de migração conforme registros da semana.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Tartaruga-marinha'],
        tagNames: ['MIGRATION'],
        latitude: -29.684,
        longitude: -53.8069
    },
    {
        title: 'Tubarão-baleia em área costeira',
        description:
            'Um tubarão-baleia foi observado em águas rasas antes de seguir para mar aberto.',
        authorUsername: 'demo_user_two',
        speciesNames: ['Tubarão-baleia'],
        tagNames: ['REPORT'],
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
                where: { email: userData.email },
                update: {
                    username: userData.username,
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

        for (const speciesData of PLACEHOLDER_SPECIES) {
            await prisma.species.upsert({
                where: { name: speciesData.name },
                update: {
                    scientificName: speciesData.scientificName,
                    group: speciesData.group
                },
                create: {
                    name: speciesData.name,
                    scientificName: speciesData.scientificName,
                    group: speciesData.group
                }
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

                const firstMessage = await prisma.message.findFirst({
                    where: {
                        threadId: existingThread.id
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                });

                if (!firstMessage) {
                    await prisma.message.create({
                        data: {
                            content: threadData.description,
                            authorId: author.id,
                            threadId: existingThread.id
                        }
                    });
                }

                continue;
            }

            const thread = await prisma.thread.create({
                data: {
                    title: threadData.title,
                    latitude: threadData.latitude,
                    longitude: threadData.longitude,
                    authorId: author.id,
                    threadTags: {
                        create: normalizedTagNames.map(tagName => ({
                            tag: {
                                connect: {
                                    name: tagName
                                }
                            }
                        }))
                    },
                    threadSpecies: {
                        create: threadData.speciesNames.map(speciesName => ({
                            species: {
                                connect: {
                                    name: speciesName
                                }
                            }
                        }))
                    }
                }
            });

            await prisma.message.create({
                data: {
                    content: threadData.description,
                    authorId: author.id,
                    threadId: thread.id
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
