import db from '../db/db.js';
import TColumnValue from '../types/TColumnValue.js';
import ApiError from '../utils/ApiError.js';
import Token from '../utils/Token.js';

interface ISelectOptions {
    filters?: string[]; // raw SQL fragments, e.g. "status = 'active'" or "age > 18"
    limit?: number;
    offset?: number;
    orderBy?: string;   
}

abstract class Model {
    protected static table: string;

    protected static authenticate(token: string): number {
        const user = Token.decode(token);
        if (!user || typeof user !== 'object' || !('id' in user))
            throw new ApiError('Invalid token', 401);

        return user.id as number;
    }

    protected static insert(columns: string[], values: TColumnValue[]): number {
        if (!this.table) throw new ApiError('Model.table is not defined');
        if (!columns || columns.length === 0) throw new ApiError('No columns provided for insert');
        
        const cols = columns.join(', ');
        const placeholders = columns.map(() => '?').join(', ');

        const query = `INSERT INTO ${this.table} (${cols}) VALUES (${placeholders})`;
        const res = db.execute(query, values);
        return (res.lastInsertRowid ?? 0) as number;
    }

    protected static selectById<T extends object>(id: number, columns: '*' | string[], options?: ISelectOptions): T {
        if (!this.table) throw new ApiError('Model.table is not defined');

        const cols = columns === '*' ? '*' : columns.join(', ');
        let sql = `SELECT ${cols} FROM ${this.table}`;

        const whereClausules: string[] = [];
        const params: TColumnValue[] = [];

        if (id > 0) {
            whereClausules.push('id = ?');
            params.push(id);
        }

        // Add where clausules from options.filters
        if (options && options.filters && options.filters.length > 0)
            whereClausules.push(...options.filters);

        if (whereClausules.length) sql += ` WHERE ${whereClausules.join(' AND ')}`;
        if (options && options.orderBy) sql += ` ORDER BY ${options.orderBy}`;
        if (options && typeof options.limit === 'number') sql += ` LIMIT ${options.limit}`;
        if (options && typeof options.offset === 'number') sql += ` OFFSET ${options.offset}`;

        const data = db.select<T>(sql, params);
        if (!data.rows || data.rows.length === 0) throw new ApiError('Failed to select', 404);

        return data.rows[0];
    }

    protected static selectAll<T extends object>(columns: '*' | string[], options?: ISelectOptions): T[] {
        if (!this.table) throw new ApiError('Model.table is not defined');

        const cols = columns === '*' ? '*' : columns.join(', ');
        let sql = `SELECT ${cols} FROM ${this.table}`;
        // Add where clausules from options.filters
        if (options && options.filters && options.filters.length > 0)
            sql += ` WHERE ${options.filters.join(' AND ')}`;

        if (options && options.orderBy) sql += ` ORDER BY ${options.orderBy}`;
        if (options && typeof options.limit === 'number') sql += ` LIMIT ${options.limit}`;
        if (options && typeof options.offset === 'number') sql += ` OFFSET ${options.offset}`;

        const data = db.select<T>(sql);
        return data.rows ? data.rows : [] as T[];
    }

    protected static updateById(id: number, columns: string[], values: TColumnValue[]): void {
        if (!this.table) throw new ApiError('Model.table is not defined');
        if (!columns || columns.length === 0) throw new ApiError('No columns provided for update');
        if (values.length !== columns.length) throw new ApiError('Values length must match columns length');
        
        const set = columns.map(col => `${col} = ?`).join(', ');
        const sql = `UPDATE ${this.table} SET ${set} WHERE id = ?`;

        const params: TColumnValue[] = [...values, id];
        const res = db.execute(sql, params);
        if (!res || res.changes === 0) throw new ApiError('Update failed or no rows affected');
    }

    protected static deleteById(id: number): void {
        if (!this.table) throw new ApiError('Model.table is not defined');
        const sql = `DELETE FROM ${this.table} WHERE id = ?`;
        const res = db.execute(sql, [id]);
        if (!res || res.changes === 0) throw new ApiError('Failed to delete');
    }
}

export default Model;
