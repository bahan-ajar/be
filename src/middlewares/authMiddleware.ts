import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtUserPayload } from '../types';

/**
 * Middleware untuk mengekstrak token JWT dari header Authorization
 * dan menyimpan ID pengguna ke dalam res.locals.userId
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({
            success: false,
            message: 'Akses ditolak. Token otorisasi tidak ditemukan.',
        });
        return;
    }

    // Format yang diharapkan: Bearer <token>
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({
            success: false,
            message: 'Format token tidak valid. Gunakan format "Bearer <token>".',
        });
        return;
    }

    const token = parts[1];
    const secret = process.env.JWT_SECRET || 'rahasia_super_aman_jwt_secret_key_12345';

    try {
        const decoded = jwt.verify(token, secret) as JwtUserPayload;

        // Simpan ID pengguna ke dalam res.locals.userId sesuai instruksi
        res.locals.userId = decoded.id;
        res.locals.user = decoded;

        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: 'Token telah kedaluwarsa. Silakan login kembali.',
            });
            return;
        }

        res.status(401).json({
            success: false,
            message: 'Token tidak valid atau gagal diverifikasi.',
        });
        return;
    }
};
