import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Controller untuk Registrasi Akun Pengguna Baru
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: 'Nama, email, dan kata sandi wajib diisi.',
            });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: 'Kata sandi minimal 6 karakter.',
            });
            return;
        }

        const newUser = await AuthService.register({ name, email, password, role });

        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil. Silakan login.',
            data: newUser,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Registrasi gagal.',
        });
    }
};

/**
 * Controller untuk Login Pengguna
 * POST /api/auth/login & POST /api/login
 * Langkah 2: Mengatur HTTP-only, Secure, SameSite Cookie
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, username, password } = req.body;
        const identifier = email || username;

        if (!identifier || !password) {
            res.status(400).json({
                success: false,
                message: 'Email/username dan kata sandi wajib diisi.',
            });
            return;
        }

        const result = await AuthService.login(identifier, password);

        // Langkah 2: Atur cookie dengan HttpOnly, Secure, dan SameSite
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 hari
            path: '/',
        });

        // Set juga cookie session sebagai alias
        res.cookie('session', result.token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
        });

        res.status(200).json({
            success: true,
            message: 'Login berhasil.',
            token: result.token,
            user: result.user,
        });
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: error.message || 'Email atau kata sandi tidak valid.',
        });
    }
};

/**
 * Controller untuk Logout Pengguna
 * POST /api/auth/logout
 * Langkah 2: Mengakhiri sesi dan mencabut cookie
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
        });
        res.clearCookie('session', {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
        });

        res.status(200).json({
            success: true,
            message: 'Logout berhasil. Sesi telah diakhiri.',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Gagal memproses logout.',
        });
    }
};

/**
 * Controller untuk mendapatkan identitas diri yang sedang login
 * GET /api/auth/me & GET /api/me
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = res.locals.userId || (req as any).user?.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Pengguna belum terotentikasi.',
            });
            return;
        }

        const user = await AuthService.getProfile(userId);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: error.message || 'Pengguna tidak ditemukan.',
        });
    }
};

/**
 * Langkah 5: RBAC - Mendapatkan daftar seluruh user (Khusus Admin)
 * GET /api/users
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await AuthService.getAllUsers();
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Gagal memuat data pengguna.',
        });
    }
};

/**
 * Langkah 5: RBAC - Menghapus user (Khusus Admin)
 * DELETE /api/users/:id
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const targetId = Number(req.params.id);
        const currentUserId = res.locals.userId;

        if (targetId === currentUserId) {
            res.status(400).json({
                success: false,
                message: 'Tidak dapat menghapus akun admin yang sedang aktif digunakan.',
            });
            return;
        }

        const deleted = await AuthService.deleteUser(targetId);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Pengguna tidak ditemukan.',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Pengguna ID #${targetId} berhasil dihapus.`,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Gagal menghapus pengguna.',
        });
    }
};
