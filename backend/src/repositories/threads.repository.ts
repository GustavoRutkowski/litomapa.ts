import prisma from '../lib/prisma.js';
import type Thread from '../models/threads.model.js';

type FindAllParams = {
    offset?: number;
    limit?: number;
    tag?: string;
    author?: string;
    title?: string;
};

type FindAllResponse = [number, Thread[]];

export default class ThreadRepository {
    static async findAll({
        offset = 0,
        limit = 10,
        tag,
        author,
        title
    }: FindAllParams): Promise<FindAllResponse> {
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

        const select = {
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

        const total = await prisma.thread.count({ where });

        const threads = await prisma.thread.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
            select
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
}

export { FindAllParams as ThreadFindAllParams, FindAllResponse as ThreadFindAllResult };
