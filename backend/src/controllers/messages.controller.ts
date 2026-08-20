import { Request, Response } from 'express';
import MessageService from '../services/messages.service.js';
import { ThreadIdSchema } from '../schemas/threads.schemas.js';
import U from '../utils/UnknownError.js';
import { formatErrors } from '../utils/formatErrors.js';

export default class MessageController {
    static async getAllByThreadId(req: Request, res: Response) {
        const result = ThreadIdSchema.safeParse(req.params.id);

        if (!result.success) {
            const errors = formatErrors(result.error);
            return res.status(400).json({ success: false, errors });
        }

        try {
            const data = await MessageService.findAllByThreadId(result.data);
            res.status(200).json({ success: true, data });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }
}
