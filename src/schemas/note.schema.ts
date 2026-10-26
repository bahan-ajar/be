import { z } from 'zod';

/**
 * Langkah 5: Skema Validasi Catatan (Note) menggunakan Zod
 * Nilai dari form selalu berupa string, jadi angka perlu z.coerce.number().
 */
export const NoteSchema = z.object({
    title: z
        .string({ error: 'Judul catatan wajib diisi' })
        .trim()
        .min(3, 'Judul catatan minimal 3 karakter')
        .max(100, 'Judul catatan maksimal 100 karakter'),
    content: z
        .string({ error: 'Isi catatan wajib diisi' })
        .trim()
        .min(10, 'Isi catatan minimal 10 karakter'),
    category: z
        .enum(['Kuliah', 'Tugas', 'Pribadi', 'Ujian'], {
            error: 'Kategori harus dipilih antara: Kuliah, Tugas, Pribadi, atau Ujian',
        })
        .default('Kuliah'),
    priority: z.coerce
        .number({ error: 'Prioritas harus berupa angka 1 - 5' })
        .min(1, 'Prioritas minimal 1')
        .max(5, 'Prioritas maksimal 5')
        .default(3),
});

export const UpdateNoteSchema = NoteSchema.partial();

export type NoteInput = z.infer<typeof NoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
