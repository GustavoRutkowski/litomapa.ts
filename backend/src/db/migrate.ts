import { readFileSync } from 'fs';
import { resolve } from 'path';
import db from './db.js';

const SCHEMA_PATH: string = resolve('backend/src/db/schema.sql');

try {
    const schema: string = readFileSync(SCHEMA_PATH, 'utf-8');
    db.createSchema(schema);

    console.log('Banco inicializado com sucesso!');
} catch (e: any) {
    console.error('Erro ao executar schema:', e.message);
    process.exit(1);
}
