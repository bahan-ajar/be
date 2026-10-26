import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtUserPayload } from '../types';

/**
 * Pertemuan 9 — Langkah 2 & 3: Middleware Authentication
 * Mengekstrak token dari HTTP-only cookie atau Authorization header.
 * Memverifikasi validitas token dan menyimpan identitas user.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    let token: string | undefined;

    // 1. Cek dari HTTP-only cookie
    if (req.cookies && (req.cookies.token || req.cookies.session)) {
        token = req.cookies.token || req.cookies.session;
    }

    // 2. Cek dari Authorization Header (Bearer token)
    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }

    // Jika token tidak ditemukan sama sekali -> 401 Unauthorized
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Akses ditolak. Silakan login terlebih dahulu untuk melanjutkan.',
        });
        return;
    }

    const secret = process.env.JWT_SECRET || 'rahasia_super_aman_jwt_secret_key_12345';

    try {
        const decoded = jwt.verify(token, secret) as JwtUserPayload;

        // Pasang user ke res.locals dan req untuk controller selanjutnya
        res.locals.userId = decoded.id;
        res.locals.user = decoded;
        (req as any).user = decoded;

        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: 'Sesi Anda telah berakhir. Silakan login kembali.',
            });
            return;
        }

        res.status(401).json({
            success: false,
            message: 'Token otentikasi tidak valid atau sudah kedaluwarsa.',
        });
        return;
    }
};

export default authMiddleware;
