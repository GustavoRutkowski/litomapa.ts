import { mkdir, unlink, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { randomBytes } from 'crypto';
import ApiError from './ApiError.js';
import U from './UnknownError.js';
import IBase64File from '../types/IBase64File.js';

interface IFileUploaderConstructor {
    path: string;
    minsize: number;
    maxsize: number;
    allowedTypes: string[];
}

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
        } catch (e: unknown) {
            if (U.getCode<string>(e, '') !== 'ENOENT') throw e;
        }
    }

    public async upload({ base64, filename }: IBase64File): Promise<string> {
        // Extrai MIME se vier no formato data:<mime>;base64,...
        const match = base64.match(/^data:(.+);base64,(.*)$/);

        const mimeType = (match && match[1]) || null;
        const base64Data = (match && match[2]) || base64;

        if (mimeType && !this.allowedTypes.includes(mimeType))
            throw new ApiError('Tipo de arquivo não permitido', 400);

        const buffer = Buffer.from(base64Data, 'base64');
        const size = buffer.length;

        if (size < this.minsize)
            throw new ApiError('Arquivo menor que o tamanho mínimo permitido', 400);

        if (size > this.maxsize)
            throw new ApiError('Arquivo maior que o tamanho máximo permitido', 400);

        const ext = extname(filename).toLowerCase();
        const finalFilename = randomBytes(16).toString('hex') + ext;
        const filePath = join(this.uploadPath, finalFilename);

        await writeFile(filePath, buffer);
        return finalFilename;
    }
}

export default FileUploader;
