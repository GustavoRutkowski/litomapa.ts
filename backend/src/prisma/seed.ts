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
        description:
            'Observed an adult sea turtle close to the mangrove entrance around 08:30 this morning. The animal appeared healthy and continued swimming toward deeper waters.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['SIGHTING', 'Migration'],
        latitude: -30.0346,
        longitude: -51.2177
    },
    {
        title: 'Capybara family near riverbank',
        description:
            'A group of four capybaras was seen resting near the riverbank during the afternoon. No visible injuries or unusual behavior were noticed.',
        authorUsername: 'demo_user_two',
        speciesNames: ['Capybara'],
        tagNames: ['SIGHTING'],
        latitude: -31.7681,
        longitude: -52.3205
    },
    {
        title: 'Possible illegal fishing activity',
        description:
            'Fishing nets were observed in an area where fishing is restricted. The equipment remained unattended for several hours.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['REPORT'],
        latitude: -29.1658,
        longitude: -51.1794
    },
    {
        title: 'Invasive species on urban trail',
        description:
            'An invasive animal was observed crossing the main trail inside the park. Additional monitoring may be required.',
        authorUsername: 'demo_user_two',
        speciesNames: ['Capybara'],
        tagNames: ['INVASIVE_SPECIES', 'REPORT'],
        latitude: -29.1627,
        longitude: -51.1767
    },
    {
        title: 'Migration corridor update',
        description:
            'Sea turtles continue to use the expected migration corridor according to observations collected this week.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['MIGRATION'],
        latitude: -29.684,
        longitude: -53.8069
    },
    {
        title: 'Capybara movement after heavy rain',
        description:
            'Several fresh tracks indicate increased capybara movement following heavy rainfall in the region.',
        authorUsername: 'demo_user_two',
        speciesNames: ['Capybara'],
        tagNames: ['REPORT', 'MIGRATION'],
        latitude: -27.4689,
        longitude: -52.2724
    },
    {
        title: 'Juvenile sea turtle near beach',
        description:
            'A juvenile sea turtle was found swimming close to shore before returning safely to deeper water.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['SIGHTING'],
        latitude: -32.1201,
        longitude: -52.1076
    },
    {
        title: 'Capybara crossing highway access',
        description:
            'A capybara crossed the access road near sunset. Drivers should be warned about wildlife crossings.',
        authorUsername: 'demo_user_two',
        speciesNames: ['Capybara'],
        tagNames: ['REPORT'],
        latitude: -29.9939,
        longitude: -51.1711
    },
    {
        title: 'Sea turtle nesting evidence',
        description:
            'Possible nesting tracks were identified on the beach during the early morning inspection.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['REPORT'],
        latitude: -31.3224,
        longitude: -50.9648
    },
    {
        title: 'Capybara observed with offspring',
        description:
            'Two adult capybaras accompanied by three offspring were observed feeding near the wetland.',
        authorUsername: 'demo_user_two',
        speciesNames: ['Capybara'],
        tagNames: ['SIGHTING'],
        latitude: -30.8512,
        longitude: -51.8044
    },
    {
        title: 'Sea turtle feeding behavior',
        description:
            'An adult sea turtle was observed feeding for approximately twenty minutes near the rocky shore.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['SIGHTING'],
        latitude: -29.8774,
        longitude: -50.1472
    },
    {
        title: 'Capybara tracks near marsh',
        description:
            'Fresh footprints were found around the marsh, indicating recent movement through the area.',
        authorUsername: 'demo_user_two',
        speciesNames: ['Capybara'],
        tagNames: ['REPORT'],
        latitude: -30.4307,
        longitude: -53.8931
    },
    {
        title: 'Sea turtle entangled in debris',
        description:
            'A sea turtle was briefly entangled in floating debris before being released without apparent injuries.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['REPORT'],
        latitude: -32.0354,
        longitude: -52.0869
    },
    {
        title: 'Capybara resting near lagoon',
        description:
            'One adult capybara remained resting close to the lagoon throughout the afternoon.',
        authorUsername: 'demo_user_two',
        speciesNames: ['Capybara'],
        tagNames: ['SIGHTING'],
        latitude: -30.2451,
        longitude: -50.9387
    },
    {
        title: 'Migration route confirmed',
        description:
            'Repeated observations confirm that sea turtles continue following the expected migration route.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['MIGRATION'],
        latitude: -31.5402,
        longitude: -51.968
    },
    {
        title: 'Capybara near public park',
        description:
            'A capybara was seen walking close to visitors during the morning. No aggressive behavior was observed.',
        authorUsername: 'demo_user_two',
        speciesNames: ['Capybara'],
        tagNames: ['SIGHTING'],
        latitude: -29.6945,
        longitude: -53.8018
    },
    {
        title: 'Sea turtle rescued by volunteers',
        description:
            'Local volunteers assisted a sea turtle trapped among rocks before it safely returned to the sea.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['REPORT'],
        latitude: -32.1708,
        longitude: -52.1625
    },
    {
        title: 'Capybara herd expanding',
        description:
            'The number of capybaras observed in this wetland has increased compared to previous surveys.',
        authorUsername: 'demo_user_two',
        speciesNames: ['Capybara'],
        tagNames: ['REPORT', 'MIGRATION'],
        latitude: -28.5154,
        longitude: -50.9392
    },
    {
        title: 'Sea turtle near fishing boats',
        description:
            'A sea turtle remained close to small fishing boats for several minutes before moving offshore.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['SIGHTING'],
        latitude: -31.9015,
        longitude: -52.3568
    },
    {
        title: 'Capybara activity at dawn',
        description:
            'Most capybara activity occurred shortly after sunrise according to field observations.',
        authorUsername: 'demo_user_two',
        speciesNames: ['Capybara'],
        tagNames: ['REPORT'],
        latitude: -29.458,
        longitude: -51.9588
    },
    {
        title: 'Sea turtle following current',
        description:
            'The turtle appeared to be following the coastal current while remaining close to the shoreline.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['MIGRATION'],
        latitude: -30.9221,
        longitude: -50.8645
    },
    {
        title: 'Capybara drinking at reservoir',
        description:
            'One capybara was observed drinking water before returning to nearby vegetation.',
        authorUsername: 'demo_user_two',
        speciesNames: ['Capybara'],
        tagNames: ['SIGHTING'],
        latitude: -30.0078,
        longitude: -52.3719
    },
    {
        title: 'Sea turtle with shell markings',
        description:
            'Distinct shell markings may help identify this individual in future monitoring activities.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['SIGHTING'],
        latitude: -31.4117,
        longitude: -51.4278
    },
    {
        title: 'Capybara observed during survey',
        description:
            'The animal remained calm throughout the survey and eventually moved into nearby vegetation.',
        authorUsername: 'demo_user_two',
        speciesNames: ['Capybara'],
        tagNames: ['REPORT'],
        latitude: -29.7822,
        longitude: -52.4283
    },
    {
        title: 'Sea turtle migration confirmed by volunteers',
        description:
            'Multiple volunteers independently reported sea turtles moving north along the coastline this week.',
        authorUsername: 'demo_user_one',
        speciesNames: ['Sea turtle'],
        tagNames: ['MIGRATION'],
        latitude: -32.0819,
        longitude: -51.9862
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
