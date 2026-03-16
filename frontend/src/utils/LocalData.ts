interface IStoredData {
    data: any;
    expires_in?: number;
}

class LocalData {
    public static get<T = any>(key: string): T | null {
        const item = localStorage.getItem(key);
        if (!item) return null;

        let parsed = null;
        try { parsed = JSON.parse(item); }
        catch (e) { parsed = item; }

        if (parsed.expires_in && Date.now() > parsed.expires_in) {
            this.remove(key);
            return null;
        }
        return parsed.data as T;
    }

    public static set(key: string, value: any, expiresIn: number = 0): void {
        const data: IStoredData = { data: value };
        if (expiresIn) data.expires_in = Date.now() + expiresIn;
        localStorage.setItem(key, JSON.stringify(data));
    }

    public static remove(key: string): void { localStorage.removeItem(key); }
    public static clear(): void { localStorage.clear(); }
}

export default LocalData;