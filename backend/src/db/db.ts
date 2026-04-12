import SQLiteDatabase, { Database as TConnection } from 'better-sqlite3';
import { config } from 'dotenv';
import TColumnValue from '../types/TColumnValue.js';
config();

export interface ISelectResult<T = unknown> {
    rows: T[] | null;
    affectedRows: number;
}

export interface IExecuteResult {
    changes: number;
    lastInsertRowid: number | null;
    affectedRows: number;
}

class Database {
    private static instance: Database;
    private connection: TConnection;

    private constructor() {
        const dbname: string = process.env.DB_NAME || 'database';
        const verbose = process.env.NODE_ENV === 'dev' ? console.info : undefined;

        this.connection = new SQLiteDatabase(`${dbname}.sqlite`, { verbose });
        this.connection.pragma('foreign_keys = ON');
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public createSchema(sql: string) {
        try {
            this.connection.exec(sql);
        } catch (e: unknown) {
            console.error('Erro ao executar schema:', e);
            throw e;
        }
    }

    public select<T = unknown>(sql: string, params?: TColumnValue[]): ISelectResult<T> {
        const stmt = this.connection.prepare(sql);
        const rows = params ? stmt.all(...params) : stmt.all();
        const affectedRows = Array.isArray(rows) ? rows.length : rows ? 1 : 0;
        return { rows, affectedRows } as ISelectResult<T>;
    }

    public execute(sql: string, params?: TColumnValue[]): IExecuteResult {
        const stmt = this.connection.prepare(sql);
        const { changes = 0, lastInsertRowid = null } = params ? stmt.run(...params) : stmt.run();
        return { changes, affectedRows: changes, lastInsertRowid } as IExecuteResult;
    }

    public close() {
        this.connection.close();
    }
}

const db = Database.getInstance(); // Singleton Pattern
export default db;
