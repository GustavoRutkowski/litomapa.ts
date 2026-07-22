import { Request, Response } from 'express';
import AuthRequest from '../types/AuthRequest.js';
import UserService from '../services/users.service.js';
import {
    CreateUserSchema,
    LoginSchema,
    UpdateUserInfosSchema,
    UpdateUserPasswordSchema
} from '../schemas/users.schemas.js';
import { IdSchema } from '../schemas/global.schemas.js';
import U from '../utils/UnknownError.js';
import { formatErrors } from '../utils/formatErrors.js';

export default class UserController {
    static async create({ body }: Request, res: Response) {
        const result = CreateUserSchema.safeParse(body);

        if (!result.success) {
            const errors = formatErrors(result.error);
            return res.status(400).json({ success: false, errors });
        }

        try {
            const insertId = await UserService.create(result.data);
            res.status(201).json({ success: true, insertId });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }

    static async login({ body }: Request, res: Response) {
        const result = LoginSchema.safeParse(body);

        if (!result.success) {
            const errors = formatErrors(result.error);
            return res.status(400).json({ success: false, errors });
        }

        try {
            const token = await UserService.login(result.data);
            res.status(200).json({ success: true, token });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }

    static async get({ user_id }: AuthRequest, res: Response) {
        const result = IdSchema.safeParse(user_id);

        if (!result.success) {
            const errors = formatErrors(result.error);
            return res.status(400).json({ success: false, errors });
        }

        try {
            const data = await UserService.get(result.data);
            res.status(200).json({ success: true, data });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }

    static async changeInfos(req: AuthRequest, res: Response) {
        const idResult = IdSchema.safeParse(req.user_id);
        if (!idResult.success) {
            const errors = formatErrors(idResult.error);
            return res.status(400).json({ success: false, errors });
        }

        const bodyResult = UpdateUserInfosSchema.safeParse(req.body);
        if (!bodyResult.success) {
            const errors = formatErrors(bodyResult.error);
            return res.status(400).json({ success: false, errors });
        }

        try {
            await UserService.changeInfos(idResult.data, bodyResult.data);
            res.status(200).json({ success: true });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }

    static async changePassword(req: AuthRequest, res: Response) {
        const idResult = IdSchema.safeParse(req.user_id);
        if (!idResult.success) {
            const errors = formatErrors(idResult.error);
            return res.status(400).json({ success: false, errors });
        }

        const bodyResult = UpdateUserPasswordSchema.safeParse(req.body);
        if (!bodyResult.success) {
            const errors = formatErrors(bodyResult.error);
            return res.status(400).json({ success: false, errors });
        }

        try {
            await UserService.changePassword(idResult.data, bodyResult.data);
            res.status(200).json({ success: true });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }
}
