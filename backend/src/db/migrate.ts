import { readFileSync } from 'fs';
import { resolve } from 'path';
import connection from './connection';

const SCHEMA_PATH: string = resolve('backend/db/schema.sql');

try {
    const schema: string = readFileSync(SCHEMA_PATH, 'utf-8');
    connection.exec(schema);

    console.log('Banco inicializado com sucesso!');
} catch (e: any) {
    console.error('Erro ao executar schema:', e.message);
    process.exit(1);
}
