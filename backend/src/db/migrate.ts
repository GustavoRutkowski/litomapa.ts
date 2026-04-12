import { readFileSync } from 'fs';
import { resolve } from 'path';
import db from './db.js';
import U from '../utils/UnknownError.js';

const SCHEMA_PATH: string = resolve('backend/src/db/schema.sql');

try {
    const schema: string = readFileSync(SCHEMA_PATH, 'utf-8');
    db.createSchema(schema);
    console.info('Banco inicializado com sucesso!');
} catch (e: unknown) {
    console.error('Erro ao executar schema:', U.getMessage(e));
    process.exit(1);
}
