import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, findUserById } from '../models/userModel';
import { JwtUserPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_super_aman_jwt_secret_key_12345';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

/**
 * Controller untuk proses login pengguna
 * Membandingkan password hash menggunakan bcrypt dan membuat token JWT
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, username, password } = req.body;
        const targetEmail = email || username;

        // Cari user berdasarkan email dari database melalui userModel (SQL murni)
        const user = await findUserByEmail(targetEmail);
        if (!user || !user.password) {
            res.status(401).json({
                success: false,
                message: 'Email atau kata sandi tidak valid.',
            });
            return;
        }

        // Verifikasi password dengan bcrypt.compare
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401).json({
                success: false,
                message: 'Email atau kata sandi tidak valid.',
            });
            return;
        }

        // Buat payload JWT
        const payload: JwtUserPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        // Generate token JWT
        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: (JWT_EXPIRES_IN || '1d') as any,
        });

        res.status(200).json({
            success: true,
            message: 'Login berhasil.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error saat login:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat memproses login.',
        });
    }
};

/**
 * Controller untuk mendapatkan info user yang sedang login (me/profile)
 * Mengambil userId dari res.locals.userId yang disimpan oleh authMiddleware
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = res.locals.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User ID tidak ditemukan dalam sesi.',
            });
            return;
        }

        const user = await findUserById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Pengguna tidak ditemukan.',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error('Error saat mengambil data profil user:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};
