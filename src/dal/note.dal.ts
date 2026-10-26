import pool from '../config/db';
import { Note } from '../types';

// In-memory fallback untuk data Notes (Catatan)
const memoryNotes: Note[] = [
    {
        id: 1,
        title: 'Materi Kuliah Pemrograman Web Lanjut',
        content: 'Mempelajari arsitektur Express.js, Data Access Layer (DAL), serta implementasi JWT dan session cookie.',
        category: 'Kuliah',
        priority: 4,
        userId: 1, // Milik Budi
        authorName: 'Dr. Budi Santoso, M.Kom.',
        created_at: new Date('2026-01-15T10:00:00Z').toISOString(),
        updated_at: new Date('2026-01-15T10:00:00Z').toISOString(),
    },
    {
        id: 2,
        title: 'Pengumpulan Tugas Database Pertemuan 9',
        content: 'Pastikan migrasi database dan skema autentikasi sudah divalidasi menggunakan Zod sebelum deadline.',
        category: 'Tugas',
        priority: 5,
        userId: 1, // Milik Budi
        authorName: 'Dr. Budi Santoso, M.Kom.',
        created_at: new Date('2026-01-16T11:00:00Z').toISOString(),
        updated_at: new Date('2026-01-16T11:00:00Z').toISOString(),
    },
    {
        id: 3,
        title: 'Riset Topik Skripsi Kecerdasan Buatan',
        content: 'Membaca paper IEEE tentang implementasi transformer pada analisa citra medis.',
        category: 'Pribadi',
        priority: 3,
        userId: 2, // Milik Siti Rahma
        authorName: 'Siti Rahma, M.Cs.',
        created_at: new Date('2026-01-17T14:30:00Z').toISOString(),
        updated_at: new Date('2026-01-17T14:30:00Z').toISOString(),
    },
];

/**
 * Langkah 4 & 6: Data Access Layer (DAL) & Ownership
 * Mengambil daftar catatan. Jika bukan admin, hanya mengambil data milik userId yang login.
 */
export async function getNotesByUserId(userId: number, isAdmin = false): Promise<Note[]> {
    try {
        let query = 'SELECT * FROM notes';
        const params: any[] = [];

        if (!isAdmin) {
            query += ' WHERE userId = ?';
            params.push(userId);
        }

        query += ' ORDER BY id DESC';
        const [rows]: any = await pool.execute(query, params);
        return rows as Note[];
    } catch {
        // Fallback in-memory
        if (isAdmin) {
            return [...memoryNotes].sort((a, b) => b.id - a.id);
        }
        return memoryNotes.filter(n => n.userId === userId).sort((a, b) => b.id - a.id);
    }
}

/**
 * Langkah 6 & 7: Cegah IDOR
 * Mengambil detail catatan berdasarkan ID dengan validasi kepemilikan (userId).
 * User A tidak bisa mengintip catatan User B dengan mengganti ID di URL!
 */
export async function getNoteById(id: number, userId: number, isAdmin = false): Promise<Note | null> {
    try {
        let query = 'SELECT * FROM notes WHERE id = ?';
        const params: any[] = [id];

        if (!isAdmin) {
            query += ' AND userId = ?';
            params.push(userId);
        }

        const [rows]: any = await pool.execute(query, params);
        if (rows && rows.length > 0) {
            return rows[0] as Note;
        }
        return null;
    } catch {
        // Fallback in-memory
        const note = memoryNotes.find(n => n.id === id);
        if (!note) return null;
        if (!isAdmin && note.userId !== userId) {
            return null; // IDOR dicegah: jika bukan miliknya, anggap tidak ditemukan (404)
        }
        return { ...note };
    }
}

/**
 * Langkah 11: Create Note dengan mutasi yang mengikat userId dari session
 */
export async function createNote(
    userId: number,
    authorName: string,
    data: { title: string; content: string; category?: string; priority?: number }
): Promise<Note> {
    const now = new Date().toISOString();
    const category = data.category || 'Kuliah';
    const priority = data.priority || 3;

    try {
        const query = 'INSERT INTO notes (title, content, category, priority, userId, authorName, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const [result]: any = await pool.execute(query, [data.title, data.content, category, priority, userId, authorName, now, now]);
        return {
            id: result.insertId,
            title: data.title,
            content: data.content,
            category,
            priority,
            userId,
            authorName,
            created_at: now,
            updated_at: now,
        };
    } catch {
        const nextId = memoryNotes.length > 0 ? Math.max(...memoryNotes.map(n => n.id)) + 1 : 1;
        const newNote: Note = {
            id: nextId,
            title: data.title,
            content: data.content,
            category,
            priority,
            userId,
            authorName,
            created_at: now,
            updated_at: now,
        };
        memoryNotes.unshift(newNote);
        return { ...newNote };
    }
}

/**
 * Langkah 14: Update Note dengan proteksi kepemilikan
 */
export async function updateNote(
    id: number,
    userId: number,
    data: { title?: string; content?: string; category?: string; priority?: number },
    isAdmin = false
): Promise<Note | null> {
    const existing = await getNoteById(id, userId, isAdmin);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updatedTitle = data.title ?? existing.title;
    const updatedContent = data.content ?? existing.content;
    const updatedCategory = data.category ?? existing.category;
    const updatedPriority = data.priority ?? existing.priority;

    try {
        let query = 'UPDATE notes SET title = ?, content = ?, category = ?, priority = ?, updated_at = ? WHERE id = ?';
        const params: any[] = [updatedTitle, updatedContent, updatedCategory, updatedPriority, now, id];
        if (!isAdmin) {
            query += ' AND userId = ?';
            params.push(userId);
        }
        await pool.execute(query, params);
        return {
            ...existing,
            title: updatedTitle,
            content: updatedContent,
            category: updatedCategory,
            priority: updatedPriority,
            updated_at: now,
        };
    } catch {
        const index = memoryNotes.findIndex(n => n.id === id);
        if (index === -1) return null;
        if (!isAdmin && memoryNotes[index].userId !== userId) return null;

        memoryNotes[index] = {
            ...memoryNotes[index],
            title: updatedTitle,
            content: updatedContent,
            category: updatedCategory,
            priority: updatedPriority,
            updated_at: now,
        };
        return { ...memoryNotes[index] };
    }
}

/**
 * Langkah 14: Delete Note dengan proteksi kepemilikan (Cegah IDOR)
 */
export async function deleteNote(id: number, userId: number, isAdmin = false): Promise<boolean> {
    const existing = await getNoteById(id, userId, isAdmin);
    if (!existing) return false;

    try {
        let query = 'DELETE FROM notes WHERE id = ?';
        const params: any[] = [id];
        if (!isAdmin) {
            query += ' AND userId = ?';
            params.push(userId);
        }
        const [res]: any = await pool.execute(query, params);
        return res.affectedRows > 0;
    } catch {
        const index = memoryNotes.findIndex(n => n.id === id);
        if (index === -1) return false;
        if (!isAdmin && memoryNotes[index].userId !== userId) return false;
        memoryNotes.splice(index, 1);
        return true;
    }
}
