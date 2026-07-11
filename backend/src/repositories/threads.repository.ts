import prisma from '../lib/prisma.js';
import type Thread from '../models/threads.model.js';

type FindAllQueryParams = {
    offset?: number;
    limit?: number;
    tag?: string;
    author?: string;
    title?: string;
};

const SELECT_STATEMENT = {
    id: true,
    title: true,
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

export default class ThreadRepository {
    static async findAll({
        offset = 0,
        limit = 10,
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

        const formatted = threads.map(thread => ({
            id: thread.id,
            title: thread.title,
            author: {
                id: thread.author.id,
                username: thread.author.username,
                photo: thread.author.photo
            },
            specie: {
                id: thread.threadSpecies[0]?.species.id,
                name: thread.threadSpecies[0]?.species.name
            },
            tags: thread.threadTags.map(item => ({
                id: item.tag.id,
                name: item.tag.name
            }))
        }));

        return [total, formatted];
    }

    static async findById(id: number): Promise<Thread | null> {
        const thread = await prisma.thread.findUnique({
            where: { id },
            select: SELECT_STATEMENT
        });

        if (!thread) return null;

        return {
            id: thread.id,
            title: thread.title,
            author: {
                id: thread.author.id,
                username: thread.author.username,
                photo: thread.author.photo
            },
            specie: {
                id: thread.threadSpecies[0]?.species.id,
                name: thread.threadSpecies[0]?.species.name
            },
            tags: thread.threadTags.map(item => ({
                id: item.tag.id,
                name: item.tag.name
            }))
        };
    }
}

export { FindAllQueryParams as ThreadFindAllQueryParams };
