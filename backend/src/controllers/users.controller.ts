import { Request, Response } from 'express';
import User from '../models/users.model.js';
import ApiError from '../utils/ApiError.js';
import Controller from './Controller.js';
import IBase64File from '../types/IBase64File.js';

interface ICreateUserBody {
    username: string;
    email: string;
    password: string;
}

interface IUserCredentialsBody {
    email: string;
    password: string;
}

type TBearerToken = `Bearer ${string}`;

class UsersController extends Controller {
    public static async createUser({ body }: Request, res: Response) {
        const { username, email, password } = body as ICreateUserBody;
        if (!super.required(['username', 'email', 'password'], body, res)) return;

        try {
            const insertId = await User.create(username, email, password);
            return res.status(201).json({ insertId });
        } catch (e: any) {
            const status = e instanceof ApiError && e.getStatus ? e.getStatus() : 500;
            return res.status(status).json({ error: e.message });
        }
    }

    public static async login({ body }: Request, res: Response) {
        if (!super.required(['email', 'password'], body, res)) return;
        const { email, password } = body as IUserCredentialsBody;

        try {
            const token = await User.login(email, password);
            return res.json({ token });
        } catch (e: any) {
            const status = e instanceof ApiError ? e.getStatus() : 500;
            return res.status(status).json({ error: e.message });
        }
    }

    public static getUser({ headers }: Request, res: Response) {
        if (!super.required(['Authorization'], headers, res)) return;

        const token = headers['Authorization'] as TBearerToken;

        try {
            const user = User.get(token.split(' ')[1]);
            return res.json(user);
        } catch (e: any) {
            const status = e instanceof ApiError ? e.getStatus() : 500;
            return res.status(status).json({ error: e.message });
        }
    }

    public static changeUsername(req: Request, res: Response) {
        if (!super.required(['Authorization'], req.headers, res)) return;
        if (!super.required(['username'], req.body, res)) return;

        const token = req.headers['Authorization'] as TBearerToken;
        const { username } = req.body as { username: string };

        try {
            User.changeUsername(token.split(' ')[1], username);
            return res.status(200).json({ success: true });
        } catch (e: any) {
            const status = e instanceof ApiError ? e.getStatus() : 500;
            return res.status(status).json({ error: e.message });
        }
    }

    public static async changePassword(req: Request, res: Response) {
        if (!super.required(['Authorization'], req.headers, res)) return;
        if (!super.required(['password'], req.body, res)) return;

        const token = req.headers['Authorization'] as TBearerToken;
        const { password } = req.body as { password: string };

        try {
            await User.changePassword(token.split(' ')[1], password);
            return res.json({ success: true });
        } catch (e: any) {
            const status = e instanceof ApiError ? e.getStatus() : 500;
            return res.status(status).json({ error: e.message });
        }
    }

    public static async changePhoto(req: Request, res: Response) {
        if (!super.required(['Authorization'], req.headers, res)) return;
        if (!super.required(['base64', 'filename'], req.body, res)) return;

        const token = req.headers['Authorization'] as TBearerToken;
        const file = req.body as IBase64File;

        try {
            await User.changePhoto(token.split(' ')[1], file);
            return res.json({ success: true });
        } catch (e: any) {
            const status = e instanceof ApiError ? e.getStatus() : 500;
            return res.status(status).json({ error: e.message });
        }
    }

    public static async removePhoto({ headers }: Request, res: Response) {
        if (!super.required(['Authorization'], headers, res)) return;
        const token = headers['Authorization'] as TBearerToken;

        try {
            await User.removePhoto(token.split(' ')[1]);
            return res.json({ success: true });
        } catch (e: any) {
            const status = e instanceof ApiError ? e.getStatus() : 500;
            return res.status(status).json({ error: e.message });
        }
    }

    public static async deleteUser({ headers }: Request, res: Response) {
        if (!super.required(['Authorization'], headers, res)) return;
        const token = headers['Authorization'] as TBearerToken;

        try {
            await User.delete(token.split(' ')[1]);
            return res.json({ success: true });
        } catch (e: any) {
            const status = e instanceof ApiError ? e.getStatus() : 500;
            return res.status(status).json({ error: e.message });
        }
    }
}

export default UsersController;
