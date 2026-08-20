import { Request, Response } from 'express';
import AuthRequest from '../types/AuthRequest.js';
import MessageService from '../services/messages.service.js';
import { CreateMessageSchema } from '../schemas/messages.schemas.js';
import { ThreadIdSchema } from '../schemas/threads.schemas.js';
import U from '../utils/UnknownError.js';
import { formatErrors } from '../utils/formatErrors.js';

export default class MessageController {
    static async create(req: AuthRequest, res: Response) {
        const threadResult = ThreadIdSchema.safeParse(req.params.id);
        const messageResult = CreateMessageSchema.safeParse(req.body);

        if (!threadResult.success || !messageResult.success) {
            const errors = {
                ...(threadResult.success ? {} : formatErrors(threadResult.error)),
                ...(messageResult.success ? {} : formatErrors(messageResult.error))
            };
            return res.status(400).json({ success: false, errors });
        }

        if (!req.user_id) {
            return res.status(401).json({
                success: false,
                errors: { global: ['Authentication required'] }
            });
        }

        try {
            const insertId = await MessageService.create({
                ...messageResult.data,
                threadId: threadResult.data,
                authorId: req.user_id
            });
            res.status(201).json({ success: true, insertId });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }

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
