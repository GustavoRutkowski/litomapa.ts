import { Request, Response } from 'express';
import ThreadService from '../services/threads.service.js';
import { ThreadsQuerySchema } from '../schemas/threads.schemas.js';
import U from '../utils/UnknownError.js';
import { formatErrors } from '../utils/formatErrors.js';

export default class ThreadController {
    static async getAll(req: Request, res: Response) {
        const result = ThreadsQuerySchema.safeParse(req.query);

        if (!result.success) {
            const errors = formatErrors(result.error);
            return res.status(400).json({ success: false, errors });
        }

        try {
            const payload = await ThreadService.findAll(result.data);
            res.status(200).json({ success: true, ...payload });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }
}
