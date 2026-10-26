import { Request, Response } from 'express';
import { getAllPresensi, updatePresensiStatus, createPresensi } from '../dal/presensi.dal';
import { PresensiStatus } from '../types';

export async function getPresensiList(req: Request, res: Response) {
    try {
        const data = await getAllPresensi();
        res.status(200).json({
            success: true,
            data,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data presensi',
        });
    }
}

export async function updateExistingPresensiStatus(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (!status) {
            res.status(400).json({
                success: false,
                message: 'Status presensi wajib diisi',
            });
            return;
        }

        const updated = await updatePresensiStatus(id, status as PresensiStatus);
        if (!updated) {
            res.status(404).json({
                success: false,
                message: 'Data presensi tidak ditemukan',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Status presensi berhasil diubah',
            data: updated,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui status presensi',
        });
    }
}

export async function createNewPresensi(req: Request, res: Response) {
    try {
        const { nim, nama, mataKuliah, tanggal, status } = req.body;
        const created = await createPresensi({
            nim,
            nama,
            mataKuliah,
            tanggal: tanggal || new Date().toISOString().split('T')[0],
            status: status || 'hadir',
        });
        res.status(201).json({
            success: true,
            message: 'Presensi berhasil dicatat',
            data: created,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'Gagal mencatat presensi',
        });
    }
}
