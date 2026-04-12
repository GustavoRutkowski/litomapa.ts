import ApiError from './ApiError.js';

export default class UnknownError {
    public static get<T = string>(e: unknown, key: string, fallback: T): T {
        if (e && typeof e === 'object' && key in e) return (e as Record<string, unknown>)[key] as T;
        return fallback;
    }

    public static getMessage(e: unknown): string {
        if (e instanceof Error) return e.message;
        return 'Internal server error';
    }

    public static getHttpStatus(e: unknown): number {
        return e instanceof ApiError ? e.getStatus() : 500;
    }

    public static getCode<T = string>(e: unknown, fallback: T): T {
        return this.get<T>(e, 'code', fallback);
    }
}
