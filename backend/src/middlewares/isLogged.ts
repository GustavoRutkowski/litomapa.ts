import AuthRequest from '../types/AuthRequest.js';
import { NextFunction, Response } from 'express';
import Token from '../utils/Token.js';

export default function isLogged(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token not provided'
        });
    }

    if (typeof token !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Token must be a string'
        });
    }

    if (!token.toLowerCase().startsWith('bearer ')) {
        return res.status(400).json({
            success: false,
            message: 'Token must be in the format: "Bearer <token>"'
        });
    }

    const decoded = Token.decode(token.split(' ')[1]);
    const isValid = decoded && typeof decoded === 'object' && 'id' in decoded;

    if (!isValid) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }

    const id = decoded.id as number;
    req.user_id = id;
    next();
}
