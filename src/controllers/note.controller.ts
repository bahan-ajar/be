import { Request, Response } from 'express';
import { getNotesByUserId, getNoteById, createNote, updateNote, deleteNote } from '../dal/note.dal';

/**
 * Controller untuk mengelola Catatan (Notes)
 * Menerapkan DAL, Ownership, ABAC, dan IDOR Prevention
 */

// GET /api/notes
export const getNotes = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user || res.locals.user;
        const isAdmin = user.role === 'admin';

        // Hanya mengambil data milik pengguna, kecuali jika admin
        const notes = await getNotesByUserId(user.id, isAdmin);

        res.status(200).json({
            success: true,
            total: notes.length,
            role: user.role,
            data: notes,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Gagal memuat daftar catatan.',
        });
    }
};

// GET /api/notes/:id (Cegah IDOR)
export const getNoteDetail = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user || res.locals.user;
        const noteId = Number(req.params.id);
        const isAdmin = user.role === 'admin';

        // DAL getNoteById memeriksa kepemilikan data (userId)
        const note = await getNoteById(noteId, user.id, isAdmin);

        // Jika ID tidak ditemukan atau milik user lain, kembalikan 404 (IDOR dicegah)
        if (!note) {
            res.status(404).json({
                success: false,
                message: 'Catatan tidak ditemukan atau Anda tidak memiliki akses ke data ini.',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: note,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Gagal memuat detail catatan.',
        });
    }
};

// POST /api/notes (Langkah 7 & 11)
export const createNewNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user || res.locals.user;

        // Ambil userId dan authorName HANYA dari session otentikasi, jangan percaya form body
        const newNote = await createNote(user.id, user.name, req.body);

        res.status(201).json({
            success: true,
            message: 'Catatan baru berhasil disimpan.',
            data: newNote,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Gagal menyimpan catatan baru.',
        });
    }
};

// PATCH /api/notes/:id (Langkah 9 & 14)
export const updateExistingNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user || res.locals.user;
        const noteId = Number(req.params.id);
        const isAdmin = user.role === 'admin';

        // Validasi ownership dilakukan di DAL
        const updated = await updateNote(noteId, user.id, req.body, isAdmin);

        if (!updated) {
            res.status(404).json({
                success: false,
                message: 'Catatan tidak ditemukan atau Anda tidak diizinkan mengubah catatan ini.',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Catatan berhasil diperbarui.',
            data: updated,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui catatan.',
        });
    }
};

// DELETE /api/notes/:id (Langkah 10 & 14)
export const deleteExistingNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user || res.locals.user;
        const noteId = Number(req.params.id);
        const isAdmin = user.role === 'admin';

        const deleted = await deleteNote(noteId, user.id, isAdmin);

        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Catatan tidak ditemukan atau Anda tidak diizinkan menghapusnya.',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Catatan #${noteId} berhasil dihapus.`,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus catatan.',
        });
    }
};
