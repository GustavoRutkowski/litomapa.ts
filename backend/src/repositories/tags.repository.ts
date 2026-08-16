import prisma from '../lib/prisma.js';
import type Tag from '../models/tags.model.js';

export default class TagRepository {
    static async findAll(): Promise<Tag[]> {
        return await prisma.tag.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true
            }
        });
    }
}
