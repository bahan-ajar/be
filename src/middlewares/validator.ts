import { Request, Response, NextFunction } from 'express';

/**
 * Middleware untuk memvalidasi kelengkapan data login (email/username dan password)
 */
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    const { email, username, password } = req.body;
    const identifier = email || username;

    if (!identifier || !password) {
        res.status(400).json({
            success: false,
            message: 'Email/username dan password wajib diisi.',
        });
        return;
    }

    if (typeof password !== 'string' || password.trim() === '') {
        res.status(400).json({
            success: false,
            message: 'Password tidak boleh kosong.',
        });
        return;
    }

    next();
};
