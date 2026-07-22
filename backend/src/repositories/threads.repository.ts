import prisma from '../lib/prisma.js';
import type Thread from '../models/threads.model.js';

type FindAllQueryParams = {
    offset?: number;
    limit?: number;
    tag?: string;
    author?: string;
    title?: string;
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
        };
    }[];
    threadTags: {
        tag: { id: number; name: string };
    }[];
}

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
                    name: true
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
    }
};

const formatThread = (thread: UnformattedThread) => ({
    id: thread.id,
    title: thread.title,
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
    species: thread.threadSpecies.map(item => item.species),
    tags: thread.threadTags.map(item => item.tag.name)
});

export default class ThreadRepository {
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
