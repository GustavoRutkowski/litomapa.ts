import { Request, Response } from 'express';
import TagService from '../services/tags.service.js';
import U from '../utils/UnknownError.js';

export default class TagController {
    static async getAll(_: Request, res: Response) {
        try {
            const data = await TagService.findAll();
            res.status(200).json({ success: true, data });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }
}
