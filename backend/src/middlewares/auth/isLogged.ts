import TMiddleware from '../../types/TMiddleware.js';
import Token from '../../utils/Token.js';
import U from '../../utils/UnknownError.js';

const isLogged: TMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

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
        Token.verify(token.split(' ')[1]);
        next();
    } catch (e: unknown) {
        res.status(401).json({
            success: false,
            message: U.get(e, 'message', 'Invalid or expired token')
        });
    }
};

export default isLogged;
