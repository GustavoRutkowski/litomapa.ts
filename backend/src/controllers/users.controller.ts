import { Request, Response } from 'express';
import AuthRequest from '../types/AuthRequest.js';
import UserService from '../services/users.service.js';
import {
    createUserSchema,
    loginSchema,
    updateUserInfosSchema,
    updateUserPasswordSchema
} from '../schemas/user.schemas.js';
import { idSchema } from '../schemas/global.schemas.js';
import U from '../utils/UnknownError.js';

export default class UserController {
    static async create({ body }: Request, res: Response) {
        const result = createUserSchema.safeParse(body);

        if (!result.success) {
            const errors = result.error.format();
            return res.status(400).json({ success: false, errors });
        }

        try {
            const insertId = await UserService.create(result.data);
            res.status(201).json({ success: true, insertId });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const message = U.getMessage(e);
            res.status(status).json({ success: false, message });
        }
    }

    static async login({ body }: Request, res: Response) {
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            const errors = result.error.format();
            return res.status(400).json({ success: false, errors });
        }

        try {
            const token = await UserService.login(result.data);
            res.status(201).json({ success: true, token });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const message = U.getMessage(e);
            res.status(status).json({ success: false, message });
        }
    }

    static async get({ user_id }: AuthRequest, res: Response) {
        const result = idSchema.safeParse(user_id);

        if (!result.success) {
            const errors = result.error.format();
            return res.status(400).json({ success: false, errors });
        }

        try {
            const data = await UserService.get(result.data);
            res.status(201).json({ success: true, data });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const message = U.getMessage(e);
            res.status(status).json({ success: false, message });
        }
    }

    static async changeInfos(req: AuthRequest, res: Response) {
        const idResult = idSchema.safeParse(req.user_id);
        if (!idResult.success) {
            const errors = idResult.error.format();
            return res.status(400).json({ success: false, errors });
        }

        const bodyResult = updateUserInfosSchema.safeParse(req.body);
        if (!bodyResult.success) {
            const errors = bodyResult.error.format();
            return res.status(400).json({ success: false, errors });
        }

        try {
            await UserService.changeInfos(idResult.data, bodyResult.data);
            res.status(201).json({ success: true });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const message = U.getMessage(e);
            res.status(status).json({ success: false, message });
        }
    }

    static async changePassword(req: AuthRequest, res: Response) {
        const idResult = idSchema.safeParse(req.user_id);
        if (!idResult.success) {
            const errors = idResult.error.format();
            return res.status(400).json({ success: false, errors });
        }

        const bodyResult = updateUserPasswordSchema.safeParse(req.body);
        if (!bodyResult.success) {
            const errors = bodyResult.error.format();
            return res.status(400).json({ success: false, errors });
        }

        try {
            await UserService.changePassword(idResult.data, bodyResult.data);
            res.status(201).json({ success: true });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const message = U.getMessage(e);
            res.status(status).json({ success: false, message });
        }
    }
}
