import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';

/**
 * Pertemuan 9 — Langkah 5: Terapkan RBAC (Role-Based Access Control)
 * Middleware untuk membatasi endpoint berdasarkan role pengguna.
 * Jika pengguna sudah login tetapi tidak mempunyai izin, kembalikan 403 Forbidden.
 */
export const requireRole = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = (req as any).user || res.locals.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Pengguna belum terotentikasi.',
            });
            return;
        }

        const userRole = user.role as UserRole;
        if (!userRole || !allowedRoles.includes(userRole)) {
            res.status(403).json({
                success: false,
                message: `Akses ditolak (403 Forbidden). Fitur ini memerlukan salah satu role: [${allowedRoles.join(', ')}]. Role Anda saat ini adalah '${userRole || 'tidak terdefinisi'}'.`,
            });
            return;
        }

        next();
    };
};

export const requireAdmin = requireRole(['admin']);
