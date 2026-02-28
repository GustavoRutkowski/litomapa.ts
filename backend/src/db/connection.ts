import Database from 'better-sqlite3';
import { config } from 'dotenv';
config();

const dbname: string = process.env.DB_NAME || 'database';
const verbose = process.env.NODE_ENV === 'dev'
    ? console.log : undefined;

const connection = new Database(`${dbname}.sqlite`, { verbose });
connection.pragma('foreign_keys = ON');

export default connection;
