import { mkdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import ApiError from './ApiError.js';
import U from './UnknownError.js';

interface IFileUploaderConstructor {
    path: string;
    minsize: number;
    maxsize: number;
    allowedTypes: string[];
}

const MIME_MAP: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'application/pdf': '.pdf'
};

class FileUploader {
    private uploadPath: string;
    private minsize: number;
    private maxsize: number;
    private allowedTypes: string[];

    constructor({
        path,
        minsize = 0,
        maxsize = Infinity,
        allowedTypes = []
    }: IFileUploaderConstructor) {
        if (!path) throw new ApiError('path do destino é obrigatório');

        this.uploadPath = path;
        this.minsize = minsize ?? 0;
        this.maxsize = maxsize ?? Infinity;
        this.allowedTypes = allowedTypes ?? [];

        mkdir(this.uploadPath, { recursive: true }).catch(() => {});
    }

    public async remove(filename: string): Promise<void> {
        const filePath = join(this.uploadPath, filename);

        try {
            await unlink(filePath);
        } catch (e) {
            if (U.getCode<string>(e, '') !== 'ENOENT') throw e;
        }
    }

    public async upload(base64: string): Promise<string> {
        // Extracts MIME and real data
        const match = base64.match(/^data:(.+);base64,(.*)$/);
        const mimeType = (match && match[1]) || null;
        const data = (match && match[2]) || base64;

        // Initial Validations
        if (!mimeType) throw new ApiError('Invalid Base64 format or no MIME type', 400);

        if (!this.allowedTypes.includes(mimeType))
            throw new ApiError(`File type ${mimeType} not allowed`, 400);

        const buffer = Buffer.from(data, 'base64');
        const size = buffer.length;

        if (size < this.minsize)
            throw new ApiError('File smaller than the minimum size allowed', 400);

        if (size > this.maxsize)
            throw new ApiError('File larger than the minimum size allowed', 400);

        // Extract the extension based on MIME
        // Try to get it from the map, if it doesn't exist,
        // try to extract the second part of the mime.
        const ext = MIME_MAP[mimeType] || `.${mimeType.split('/')[1]}`;

        // Generate the filename and save
        const filename = `${randomBytes(16).toString('hex')}${ext}`;
        const path = join(this.uploadPath, filename);

        await writeFile(path, buffer);
        return filename;
    }
}

export default FileUploader;
