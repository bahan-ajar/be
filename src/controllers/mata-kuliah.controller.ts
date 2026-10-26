import { Request, Response } from 'express';
import {
    getAllMataKuliah,
    getMataKuliahById,
    createMataKuliah,
    updateMataKuliah,
    deleteMataKuliah,
} from '../dal/mata-kuliah.dal';

export async function getMataKuliahList(req: Request, res: Response) {
    try {
        const data = await getAllMataKuliah();
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data mata kuliah',
        });
    }
}

export async function getMataKuliahDetail(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const item = await getMataKuliahById(id);
        if (!item) {
            res.status(404).json({
                success: false,
                message: 'Mata kuliah tidak ditemukan',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: item,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil detail mata kuliah',
        });
    }
}

export async function createNewMataKuliah(req: Request, res: Response) {
    try {
        const { kode, nama, sks, dosen, dosen_id } = req.body;
        if (!kode || !nama) {
            res.status(400).json({
                success: false,
                message: 'Kode dan Nama Mata Kuliah wajib diisi',
            });
            return;
        }

        const created = await createMataKuliah({
            kode,
            nama,
            sks: sks ? Number(sks) : 3,
            dosen,
            dosen_id: dosen_id ? Number(dosen_id) : 1,
        });

        res.status(201).json({
            success: true,
            message: 'Mata kuliah berhasil ditambahkan',
            data: created,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan mata kuliah',
        });
    }
}

export async function updateExistingMataKuliah(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { kode, nama, sks, dosen } = req.body;

        const updated = await updateMataKuliah(id, {
            kode,
            nama,
            sks: sks !== undefined ? Number(sks) : undefined,
            dosen,
        });

        if (!updated) {
            res.status(404).json({
                success: false,
                message: 'Mata kuliah tidak ditemukan',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Mata kuliah berhasil diperbarui',
            data: updated,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui mata kuliah',
        });
    }
}

export async function deleteExistingMataKuliah(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const deleted = await deleteMataKuliah(id);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Mata kuliah tidak ditemukan',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Mata kuliah #${id} berhasil dihapus`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus mata kuliah',
        });
    }
}
