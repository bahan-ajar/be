import { Request, Response } from 'express';
import {
    getAllMahasiswa,
    getMahasiswaById,
    createMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
} from '../dal/mahasiswa.dal';

export async function getMahasiswaList(req: Request, res: Response) {
    try {
        const data = await getAllMahasiswa();
        res.status(200).json({
            success: true,
            data,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data mahasiswa',
        });
    }
}

export async function getMahasiswaDetail(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const item = await getMahasiswaById(id);
        if (!item) {
            res.status(404).json({
                success: false,
                message: 'Mahasiswa tidak ditemukan',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: item,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil detail mahasiswa',
        });
    }
}

export async function createNewMahasiswa(req: Request, res: Response) {
    try {
        const { nim, nama, kelas, status } = req.body;
        if (!nim || !nama || !kelas) {
            res.status(400).json({
                success: false,
                message: 'NIM, Nama, dan Kelas wajib diisi',
            });
            return;
        }

        const created = await createMahasiswa({
            nim,
            nama,
            kelas,
            status: status === 'cuti' ? 'cuti' : 'aktif',
        });

        res.status(201).json({
            success: true,
            message: 'Mahasiswa berhasil ditambahkan',
            data: created,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan mahasiswa',
        });
    }
}

export async function updateExistingMahasiswa(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { nim, nama, kelas, status } = req.body;

        const updated = await updateMahasiswa(id, {
            nim,
            nama,
            kelas,
            status,
        });

        if (!updated) {
            res.status(404).json({
                success: false,
                message: 'Mahasiswa tidak ditemukan',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Mahasiswa berhasil diperbarui',
            data: updated,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data mahasiswa',
        });
    }
}

export async function deleteExistingMahasiswa(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const deleted = await deleteMahasiswa(id);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Mahasiswa tidak ditemukan',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Mahasiswa #${id} berhasil dihapus`,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus mahasiswa',
        });
    }
}
