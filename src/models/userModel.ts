import pool from '../config/db';
import { User, UserRow } from '../types';

/**
 * Mencari user berdasarkan email dengan query SQL murni
 * @param email - Email user yang dicari
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
    const query = 'SELECT id, name, email, password, created_at, updated_at FROM users WHERE email = ? LIMIT 1';
    const [rows] = await pool.execute<UserRow[]>(query, [email]);

    if (!rows || rows.length === 0) {
        return null;
    }

    return rows[0];
};

/**
 * Mencari user berdasarkan ID dengan query SQL murni
 * @param id - ID user yang dicari
 */
export const findUserById = async (id: number | string): Promise<Omit<User, 'password'> | null> => {
    const query = 'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ? LIMIT 1';
    const [rows] = await pool.execute<UserRow[]>(query, [id]);

    if (!rows || rows.length === 0) {
        return null;
    }

    const { password, ...userWithoutPassword } = rows[0];
    return userWithoutPassword;
};
