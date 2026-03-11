import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import ApiError from './ApiError.js';

class Token {
    private static SECRET = process.env.JWT_SECRET || 'default_secret_key';
    private static DEFAULT_EXPIRES = 1000 * 60 * 60; // 1 hour

    public static encode(payload: object, expiresIn = Token.DEFAULT_EXPIRES): string {
        return jwt.sign(payload, Token.SECRET as Secret, { expiresIn });
    }

    public static decode(token: string): string | JwtPayload | null {
        return jwt.decode(token);
    }

    public static verify<T extends object>(token: string): T {
        try {
            const decoded = jwt.verify(token, Token.SECRET) as T;
            return decoded;
        } catch (e: any) {
            throw new ApiError('Invalid or expired token', 401);
        }
    }
}

export default Token
