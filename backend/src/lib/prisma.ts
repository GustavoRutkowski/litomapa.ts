import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { config } from 'dotenv';
import { resolve } from 'path';
config();

const DATABASE_URL = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const file = DATABASE_URL.replace('file:', '');

const url = resolve('backend/src', file);

const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url })
});

export default prisma;
