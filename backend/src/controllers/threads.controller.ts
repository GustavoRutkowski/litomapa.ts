import { Request, Response } from 'express';
import AuthRequest from '../types/AuthRequest.js';
import ThreadService from '../services/threads.service.js';
import {
    ThreadsQuerySchema,
    ThreadIdSchema,
    CreateThreadSchema,
    ThreadVoteSchema
} from '../schemas/threads.schemas.js';
import U from '../utils/UnknownError.js';
import { formatErrors } from '../utils/formatErrors.js';

export default class ThreadController {
    static async vote(req: AuthRequest, res: Response) {
        const threadResult = ThreadIdSchema.safeParse(req.params.id);
        const voteResult = ThreadVoteSchema.safeParse(req.body);

        if (!threadResult.success || !voteResult.success) {
            const errors = {
                ...(threadResult.success ? {} : formatErrors(threadResult.error)),
                ...(voteResult.success ? {} : formatErrors(voteResult.error))
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
            await ThreadService.vote(threadResult.data, req.user_id, voteResult.data.type);
            res.status(200).json({ success: true });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }

    static async removeVote(req: AuthRequest, res: Response) {
        const result = ThreadIdSchema.safeParse(req.params.id);

        if (!result.success) {
            const errors = formatErrors(result.error);
            return res.status(400).json({ success: false, errors });
        }

        if (!req.user_id) {
            return res.status(401).json({
                success: false,
                errors: { global: ['Authentication required'] }
            });
        }

        try {
            await ThreadService.removeVote(result.data, req.user_id);
            res.status(200).json({ success: true });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }

    static async create(req: AuthRequest, res: Response) {
        const result = CreateThreadSchema.safeParse(req.body);

        if (!result.success) {
            const errors = formatErrors(result.error);
            return res.status(400).json({ success: false, errors });
        }

        if (!req.user_id) {
            return res.status(401).json({
                success: false,
                errors: { global: ['Authentication required'] }
            });
        }

        try {
            const insertId = await ThreadService.create({
                ...result.data,
                authorId: req.user_id
            });
            res.status(201).json({ success: true, insertId });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }

    static async getById(req: Request, res: Response) {
        const result = ThreadIdSchema.safeParse(req.params.id);

        if (!result.success) {
            const errors = formatErrors(result.error);
            return res.status(400).json({ success: false, errors });
        }

        try {
            const data = await ThreadService.findById(result.data);
            res.status(200).json({ success: true, data });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }

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
