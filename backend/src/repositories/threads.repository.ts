import prisma from '../lib/prisma.js';
import type Thread from '../models/threads.model.js';
import type { ThreadVoteType } from '../models/threads.model.js';
import type { SpecieGroup } from '../models/species.model.js';

type FindAllQueryParams = {
    offset?: number;
    limit?: number;
    tag?: string;
    author?: string;
    title?: string;
};

type InsertThreadData = {
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    authorId: number;
    speciesIds: number[];
    tagIds: number[];
};

type ThreadVoteData = {
    threadId: number;
    userId: number;
    type: ThreadVoteType;
};

interface UnformattedThread {
    id: number;
    title: string;
    createdAt: Date;
    latitude: number;
    longitude: number;
    author: {
        id: number;
        username: string;
        photo: string | null;
    };
    threadSpecies: {
        species: {
            id: number;
            name: string;
            scientificName: string;
            group: SpecieGroup;
        };
    }[];
    threadTags: {
        tag: { id: number; name: string };
    }[];
    messages: {
        content: string;
    }[];
}

type OrderBy = 'asc' | 'desc';

const SELECT_STATEMENT = {
    id: true,
    title: true,
    latitude: true,
    longitude: true,
    createdAt: true,
    author: {
        select: {
            id: true,
            username: true,
            photo: true
        }
    },
    threadSpecies: {
        select: {
            species: {
                select: {
                    id: true,
                    name: true,
                    scientificName: true,
                    group: true
                }
            }
        }
    },
    threadTags: {
        select: {
            tag: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    },
    messages: {
        take: 1,
        orderBy: {
            createdAt: 'asc' as OrderBy
        },
        select: {
            content: true
        }
    }
};

const formatThread = (thread: UnformattedThread) => ({
    id: thread.id,
    title: thread.title,
    description: thread.messages[0]?.content ?? null,
    createdAt: thread.createdAt.toUTCString(),
    coords: {
        latitude: thread.latitude,
        longitude: thread.longitude
    },
    author: {
        id: thread.author.id,
        username: thread.author.username,
        photo: thread.author.photo
    },
    species: thread.threadSpecies.map(item => ({
        id: item.species.id,
        name: item.species.name,
        scientific_name: item.species.scientificName,
        group: item.species.group
    })),
    tags: thread.threadTags.map(item => item.tag.name)
});

export default class ThreadRepository {
    static async exists(id: number): Promise<boolean> {
        const thread = await prisma.thread.findUnique({
            where: { id },
            select: { id: true }
        });

        return thread !== null;
    }

    static async upsertVote({ threadId, userId, type }: ThreadVoteData): Promise<void> {
        await prisma.threadVote.upsert({
            where: {
                userId_threadId: { userId, threadId }
            },
            create: { userId, threadId, type },
            update: { type }
        });
    }

    static async deleteVote(threadId: number, userId: number): Promise<void> {
        await prisma.threadVote.deleteMany({
            where: { threadId, userId }
        });
    }

    static async insert({
        title,
        description,
        latitude,
        longitude,
        authorId,
        speciesIds,
        tagIds
    }: InsertThreadData): Promise<number> {
        const result = await prisma.$transaction(async tx => {
            const thread = await tx.thread.create({
                data: {
                    title,
                    latitude,
                    longitude,
                    authorId,
                    ...(speciesIds.length > 0
                        ? {
                              threadSpecies: {
                                  create: speciesIds.map(specieId => ({
                                      species: {
                                          connect: { id: specieId }
                                      }
                                  }))
                              }
                          }
                        : {}),
                    ...(tagIds.length > 0
                        ? {
                              threadTags: {
                                  create: tagIds.map(tagId => ({
                                      tag: {
                                          connect: { id: tagId }
                                      }
                                  }))
                              }
                          }
                        : {})
                }
            });

            await tx.message.create({
                data: {
                    content: description,
                    authorId,
                    threadId: thread.id
                }
            });

            return thread.id;
        });

        return result;
    }

    static async findAll({
        offset,
        limit,
        tag,
        author,
        title
    }: FindAllQueryParams): Promise<[number, Thread[]]> {
        const TAG = tag?.trim();
        const AUTHOR_NAME = author?.trim();
        const THREAD_TITLE = title?.trim();

        const where = {
            ...(TAG
                ? {
                      threadTags: {
                          some: {
                              tag: { name: { contains: TAG } }
                          }
                      }
                  }
                : {}),
            ...(AUTHOR_NAME
                ? {
                      author: {
                          username: { contains: AUTHOR_NAME }
                      }
                  }
                : {}),
            ...(THREAD_TITLE ? { title: { contains: THREAD_TITLE } } : {})
        };

        const total = await prisma.thread.count({ where });

        const threads = await prisma.thread.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
            select: SELECT_STATEMENT
        });

        return [total, threads.map(formatThread)];
    }

    static async findById(id: number): Promise<Thread | null> {
        const thread = await prisma.thread.findUnique({
            where: { id },
            select: SELECT_STATEMENT
        });

        if (!thread) return null;
        return formatThread(thread);
    }
}

export { FindAllQueryParams as ThreadFindAllQueryParams };
