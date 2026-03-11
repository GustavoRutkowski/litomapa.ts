class ApiError extends Error {
    private status: number;

    constructor(msg: string, httpStatus: number = 500) {
        super(msg);
        this.name = 'ApiError';
        this.status = httpStatus;
    }

    public getStatus(): number {
        return this.status;
    }
}

export default ApiError;
