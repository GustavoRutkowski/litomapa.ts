import TMiddleware from '../../types/TMiddleware.js';
import Token from '../../utils/Token.js';

const isLogged: TMiddleware = (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        res.status(401).json({
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

    try {
        Token.verify(token);
        next();
    } catch(e: any) {
        res.status(401).json({
            success: false,
            message: e.message || 'Invalid or expired token'
        });
    }
}

export default isLogged;
