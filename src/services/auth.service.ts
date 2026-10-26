import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, findUserById, createUser, getAllUsers, deleteUserById } from '../dal/user.dal';
import { JwtUserPayload, User, UserRole } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_super_aman_jwt_secret_key_12345';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export class AuthService {
    /**
     * Langkah 1: Registrasi pengguna baru
     */
    static async register(data: { name: string; email: string; password: string; role?: UserRole }) {
        const existing = await findUserByEmail(data.email);
        if (existing) {
            throw new Error('Email sudah terdaftar. Silakan gunakan email lain.');
        }

        const newUser = await createUser(data);
        return newUser;
    }

    /**
     * Langkah 1 & 2: Login & pembuatan token / sesi
     */
    static async login(emailOrUsername: string, passwordPlain: string) {
        const user = await findUserByEmail(emailOrUsername);
        if (!user || !user.password) {
            throw new Error('Email atau kata sandi tidak valid.');
        }

        const isMatch = await bcrypt.compare(passwordPlain, user.password);
        if (!isMatch) {
            throw new Error('Email atau kata sandi tidak valid.');
        }

        const role: UserRole = (user.role as UserRole) || 'member';

        const payload: JwtUserPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role,
        };

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: (JWT_EXPIRES_IN || '1d') as any,
        });

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role,
            },
        };
    }

    /**
     * Mengambil profil diri sendiri
     */
    static async getProfile(userId: number) {
        const user = await findUserById(userId);
        if (!user) {
            throw new Error('Pengguna tidak ditemukan.');
        }
        return user;
    }

    /**
     * Mengambil semua pengguna (Admin RBAC)
     */
    static async getAllUsers() {
        return getAllUsers();
    }

    /**
     * Menghapus pengguna (Admin RBAC)
     */
    static async deleteUser(id: number) {
        return deleteUserById(id);
    }
}
