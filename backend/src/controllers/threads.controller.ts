import { Response } from 'express';
import AuthRequest from '../types/AuthRequest.js';
import ThreadService from '../services/threads.service.js';
import {
    ThreadsQuerySchema,
    ThreadIdSchema,
    CreateThreadSchema,
    ThreadVoteSchema
} from '../schemas/threads.schemas.js';
import U from '../utils/UnknownError.js';
import Token from '../utils/Token.js';
import { formatErrors } from '../utils/formatErrors.js';

export default class ThreadController {
    private static getOptionalUserId(req: AuthRequest): number | undefined {
        const authorization = req.headers.authorization;
        if (!authorization?.toLowerCase().startsWith('bearer ')) return undefined;

        const token = authorization.slice(7).trim();
        if (!token) return undefined;

        try {
            const payload = Token.verify<{ id?: unknown }>(token);
            return typeof payload.id === 'number' ? payload.id : undefined;
        } catch {
            return undefined;
        }
    }

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

    static async getById(req: AuthRequest, res: Response) {
        const result = ThreadIdSchema.safeParse(req.params.id);

        if (!result.success) {
            const errors = formatErrors(result.error);
            return res.status(400).json({ success: false, errors });
        }

        try {
            const userId = ThreadController.getOptionalUserId(req);
            const data = await ThreadService.findById(result.data, userId);
            res.status(200).json({ success: true, data });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }

    static async getAll(req: AuthRequest, res: Response) {
        const result = ThreadsQuerySchema.safeParse(req.query);

        if (!result.success) {
            const errors = formatErrors(result.error);
            return res.status(400).json({ success: false, errors });
        }

        try {
            const userId = ThreadController.getOptionalUserId(req);
            const payload = await ThreadService.findAll(result.data, userId);
            res.status(200).json({ success: true, ...payload });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }
}
