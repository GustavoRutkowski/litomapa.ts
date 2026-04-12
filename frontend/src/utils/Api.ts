type TMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
type TParamValue = string | number | boolean;
type TParam = [string, TParamValue];
type TEndpoint = `/${string}`;
type TLog = ((...args: string[]) => void) | null;

interface IOptions {
    headers?: Headers;
    query?: Record<string, TParamValue>;
    body?: object;
}

class Api {
    private url: string;
    private headers: Headers;
    private logger: TLog

    constructor(url: string, headers = new Headers(), log: TLog = console.error) {
        this.url = url;
        this.headers = new Headers(headers);
        this.logger = log;
    }

    private mergeHeaders(headers = new Headers()): Headers {
        const merged = new Headers(this.headers);
        if (!headers) return merged;

        headers.forEach((value, key) => merged.set(key, value));
        return merged;
    }

    public async request<T>(method: TMethod, endpoint: TEndpoint = '/', options: IOptions | null = null): Promise<T> {
        let url = `${this.url}${endpoint}`;
        
        // Query Params
        if (options?.query) {
            const query = new URLSearchParams();
            const addParam = ([k, val]: TParam) => query.append(k, val.toString());
            Object.entries(options.query).forEach(addParam);
            url += `?${query.toString()}`;
        }

        // Headers
        const headers = this.mergeHeaders(options?.headers);
        if (options?.body && !headers.has('Content-Type'))
            headers.set('Content-Type', 'application/json');

        // Body
        const request: RequestInit = { method, headers };
        if (options?.body) request.body = JSON.stringify(options.body);

        const response = await fetch(url, request);
        if (!response.ok && this.logger) {
            const msg = `HTTP error! status: ${response.status}`
            this.logger(msg); throw new Error(msg);
        }
        return await response.json() as Promise<T>;
    }

    public async get<T>(endpoint: TEndpoint, options: IOptions | null = null) {
        return await this.request<T>('GET', endpoint, options);
    }

    public async post<T>(endpoint: TEndpoint, options: IOptions | null = null) {
        return await this.request<T>('POST', endpoint, options);
    }

    public async put<T>(endpoint: TEndpoint, options: IOptions | null = null) {
        return await this.request<T>('PUT', endpoint, options);
    }

    public async patch<T>(endpoint: TEndpoint, options: IOptions | null = null) {
        return await this.request<T>('PATCH', endpoint, options);
    }

    public async delete<T>(endpoint: TEndpoint, options: IOptions | null = null) {
        return await this.request<T>('DELETE', endpoint, options);
    }
}

export default Api;
