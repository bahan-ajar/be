import pool from '../config/db';
import { User, UserRow, UserRole } from '../types';
import bcrypt from 'bcryptjs';

// In-memory fallback repository jika database MySQL belum aktif
const memoryUsers: User[] = [
    {
        id: 1,
        name: 'Dr. Budi Santoso, M.Kom.',
        email: 'budi.santoso@univ.ac.id',
        password: bcrypt.hashSync('password123', 10),
        role: 'member',
        created_at: new Date('2026-01-10T08:00:00Z'),
        updated_at: new Date('2026-01-10T08:00:00Z'),
    },
    {
        id: 2,
        name: 'Siti Rahma, M.Cs.',
        email: 'siti.rahma@univ.ac.id',
        password: bcrypt.hashSync('password123', 10),
        role: 'member',
        created_at: new Date('2026-01-12T09:00:00Z'),
        updated_at: new Date('2026-01-12T09:00:00Z'),
    },
    {
        id: 3,
        name: 'Administrator',
        email: 'admin@univ.ac.id',
        password: bcrypt.hashSync('adminpassword', 10),
        role: 'admin',
        created_at: new Date('2026-01-01T00:00:00Z'),
        updated_at: new Date('2026-01-01T00:00:00Z'),
    },
];

/**
 * Mencari user berdasarkan email.
 * Mengutamakan query database MySQL, dengan fallback aman ke data memori.
 */
export async function findUserByEmail(email: string): Promise<User | null> {
    try {
        const query = 'SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email = ? LIMIT 1';
        const [rows] = await pool.execute<UserRow[]>(query, [email.toLowerCase().trim()]);
        if (rows && rows.length > 0) {
            return rows[0];
        }
        return null;
    } catch {
        // Fallback in-memory
        const found = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        return found ? { ...found } : null;
    }
}

/**
 * Mencari user berdasarkan ID tanpa password.
 */
export async function findUserById(id: number | string): Promise<Omit<User, 'password'> | null> {
    const numId = Number(id);
    try {
        const query = 'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1';
        const [rows] = await pool.execute<UserRow[]>(query, [numId]);
        if (rows && rows.length > 0) {
            const { password, ...userWithoutPassword } = rows[0];
            return userWithoutPassword;
        }
        return null;
    } catch {
        // Fallback in-memory
        const found = memoryUsers.find(u => u.id === numId);
        if (!found) return null;
        const { password, ...userWithoutPassword } = found;
        return { ...userWithoutPassword };
    }
}

/**
 * Mengambil semua user (Khusus Admin / RBAC).
 */
export async function getAllUsers(): Promise<Omit<User, 'password'>[]> {
    try {
        const query = 'SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY id ASC';
        const [rows] = await pool.execute<UserRow[]>(query);
        return rows.map(({ password, ...u }) => u);
    } catch {
        return memoryUsers.map(({ password, ...u }) => ({ ...u }));
    }
}

/**
 * Menambahkan user baru (Registrasi).
 */
export async function createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const role: UserRole = data.role || 'member';
    const now = new Date();

    try {
        const query = 'INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
        const [result]: any = await pool.execute(query, [data.name, data.email, hashedPassword, role, now, now]);
        const newId = result.insertId;
        return {
            id: newId,
            name: data.name,
            email: data.email,
            role,
            created_at: now,
            updated_at: now,
        };
    } catch {
        const newId = memoryUsers.length > 0 ? Math.max(...memoryUsers.map(u => u.id)) + 1 : 1;
        const newUser: User = {
            id: newId,
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role,
            created_at: now,
            updated_at: now,
        };
        memoryUsers.push(newUser);
        const { password, ...withoutPassword } = newUser;
        return withoutPassword;
    }
}

/**
 * Menghapus user berdasarkan ID (Khusus Admin).
 */
export async function deleteUserById(id: number): Promise<boolean> {
    try {
        const [res]: any = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        return res.affectedRows > 0;
    } catch {
        const index = memoryUsers.findIndex(u => u.id === id);
        if (index !== -1) {
            memoryUsers.splice(index, 1);
            return true;
        }
        return false;
    }
}
