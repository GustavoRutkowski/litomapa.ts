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

class UsersController extends Controller {
    public static async createUser({ body }: Request, res: Response) {
        const { username, email, password } = body as ICreateUserBody;
        if (!super.required(['username', 'email', 'password'], body, res)) return;
        
        try {
            const insertId = await User.create(username, email, password);
            return res.status(201).json({ insertId });
        } catch (e: any) {
            const status = (e instanceof ApiError && e.getStatus) ? e.getStatus() : 500;
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
        if (!super.required(['token'], headers, res)) return;

        try {
            const user = User.get(headers.token as string);
            return res.json(user);
        } catch (e: any) {
            const status = e instanceof ApiError ? e.getStatus() : 500;
            return res.status(status).json({ error: e.message });
        }
    }

    public static changeUsername(req: Request, res: Response) {
        if (!super.required(['token'], req.headers, res)) return;
        if (!super.required(['username'], req.body, res)) return;

        const token = req.headers.token as string;
        const { username } = req.body as { username: string };

        try {
            User.changeUsername(token, username);
            return res.status(200).json({ success: true });
        } catch (e: any) {
            const status = e instanceof ApiError ? e.getStatus() : 500;
            return res.status(status).json({ error: e.message });
        }
    }

    public static async changePassword(req: Request, res: Response) {
        if (!super.required(['token'], req.headers, res)) return;
        if (!super.required(['password'], req.body, res)) return;
        
        const token = req.headers.token as string;
        const { password } = req.body as { password: string };

        try {
            await User.changePassword(token, password);
            return res.json({ success: true });
        } catch (e: any) {
            const status = e instanceof ApiError ? e.getStatus() : 500;
            return res.status(status).json({ error: e.message });
        }
    }

    public static async changePhoto(req: Request, res: Response) {
        if (!super.required(['token'], req.headers, res)) return;
        if (!super.required(['base64', 'filename'], req.body, res)) return;

        const token = req.headers.token as string;
        const file = req.body as IBase64File;

        try {
            await User.changePhoto(token, file);
            return res.json({ success: true });
        } catch (e: any) {
            const status = e instanceof ApiError ? e.getStatus() : 500;
            return res.status(status).json({ error: e.message });
        }
    }

    public static async removePhoto({ headers }: Request, res: Response) {
        if (!super.required(['token'], headers, res)) return;
        const token = headers.token as string;

        try {
            await User.removePhoto(token);
            return res.json({ success: true });
        } catch (e: any) {
            const status = e instanceof ApiError ? e.getStatus() : 500;
            return res.status(status).json({ error: e.message });
        }
    }

    public static async deleteUser({ headers }: Request, res: Response) {
        if (!super.required(['token'], headers, res)) return;
        const token = headers.token as string;

        try {
            await User.delete(token);
            return res.json({ success: true });
        } catch (e: any) {
            const status = e instanceof ApiError ? e.getStatus() : 500;
            return res.status(status).json({ error: e.message });
        }
    }
}

export default UsersController;
