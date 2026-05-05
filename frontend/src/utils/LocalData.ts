interface IStoredData {
    data: unknown;
    expires_in?: number;
}

function isStoredData(value: unknown): value is IStoredData {
    return typeof value === 'object' && value !== null && !Array.isArray(value) && 'data' in value;
}

class LocalData {
    public static get<T>(key: string): T | null {
        const item = localStorage.getItem(key);
        if (!item) return null;

        try {
            const raw: unknown = JSON.parse(item);
            if (!isStoredData(raw)) return raw as T;
            if (!raw.expires_in || Date.now() <= raw.expires_in) return raw.data as T;
            this.remove(key);
            return null;
        } catch {
            return item as T;
        }
    }

    public static set(key: string, value: unknown, expiresIn: number = 0): void {
        const data: IStoredData = { data: value };
        if (expiresIn) data.expires_in = Date.now() + expiresIn;
        localStorage.setItem(key, JSON.stringify(data));
    }

    public static remove(key: string): void {
        localStorage.removeItem(key);
    }
    public static clear(): void {
        localStorage.clear();
    }
}

export default LocalData;
