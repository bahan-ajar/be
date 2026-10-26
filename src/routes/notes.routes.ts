import { Router } from 'express';
import {
    getNotes,
    getNoteDetail,
    createNewNote,
    updateExistingNote,
    deleteExistingNote,
} from '../controllers/note.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateBody } from '../middlewares/validate.middleware';
import { NoteSchema, UpdateNoteSchema } from '../schemas/note.schema';

const router = Router();

// Semua endpoint catatan dilindungi oleh authMiddleware
router.use(authMiddleware);

// GET /api/notes - Ambil daftar catatan (terfilter per user, kecuali admin)
router.get('/', getNotes);

// GET /api/notes/:id - Ambil detail catatan (Cegah IDOR)
router.get('/:id', getNoteDetail);

// POST /api/notes - Tambah catatan baru (Validasi Zod & bind userId otomatis)
router.post('/', validateBody(NoteSchema), createNewNote);

// PATCH /api/notes/:id - Edit catatan (Validasi Zod & cek kepemilikan)
router.patch('/:id', validateBody(UpdateNoteSchema), updateExistingNote);

// DELETE /api/notes/:id - Hapus catatan (Cek kepemilikan & cegah IDOR)
router.delete('/:id', deleteExistingNote);

export default router;
