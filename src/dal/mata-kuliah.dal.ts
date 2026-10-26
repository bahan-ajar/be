import pool from '../config/db';
import { MataKuliah } from '../types';

const memoryMataKuliah: MataKuliah[] = [
    {
        id: 1,
        kode: 'MK-101',
        nama: 'Pemrograman Web Lanjut',
        sks: 3,
        dosen: 'Dr. Budi Santoso, M.Kom.',
        dosen_id: 1,
        created_at: new Date('2026-01-10T08:00:00Z').toISOString(),
    },
    {
        id: 2,
        kode: 'MK-102',
        nama: 'Basis Data Terdistribusi',
        sks: 3,
        dosen: 'Dr. Budi Santoso, M.Kom.',
        dosen_id: 1,
        created_at: new Date('2026-01-12T08:00:00Z').toISOString(),
    },
    {
        id: 3,
        kode: 'MK-103',
        nama: 'Kecerdasan Buatan',
        sks: 4,
        dosen: 'Siti Rahma, M.Cs.',
        dosen_id: 2,
        created_at: new Date('2026-01-15T08:00:00Z').toISOString(),
    },
];

export async function getAllMataKuliah(): Promise<MataKuliah[]> {
    try {
        const query = `
            SELECT mk.id, mk.kode, mk.nama, COALESCE(u.name, 'Dosen Pengampu') as dosen, mk.dosen_id,
                   3 as sks, mk.created_at, mk.updated_at
            FROM mata_kuliah mk
            LEFT JOIN users u ON mk.dosen_id = u.id
            ORDER BY mk.id ASC
        `;
        const [rows]: any = await pool.execute(query);
        if (rows && rows.length > 0) {
            return rows.map((r: any) => ({
                id: Number(r.id),
                kode: r.kode,
                nama: r.nama,
                sks: Number(r.sks || 3),
                dosen: r.dosen,
                dosen_id: r.dosen_id ? Number(r.dosen_id) : undefined,
                created_at: r.created_at,
            }));
        }
        return [...memoryMataKuliah];
    } catch {
        return [...memoryMataKuliah];
    }
}

export async function getMataKuliahById(id: number): Promise<MataKuliah | null> {
    try {
        const query = `
            SELECT mk.id, mk.kode, mk.nama, COALESCE(u.name, 'Dosen Pengampu') as dosen, mk.dosen_id,
                   3 as sks, mk.created_at, mk.updated_at
            FROM mata_kuliah mk
            LEFT JOIN users u ON mk.dosen_id = u.id
            WHERE mk.id = ?
            LIMIT 1
        `;
        const [rows]: any = await pool.execute(query, [id]);
        if (rows && rows.length > 0) {
            const r = rows[0];
            return {
                id: Number(r.id),
                kode: r.kode,
                nama: r.nama,
                sks: Number(r.sks || 3),
                dosen: r.dosen,
                dosen_id: r.dosen_id ? Number(r.dosen_id) : undefined,
                created_at: r.created_at,
            };
        }
        const found = memoryMataKuliah.find((m) => m.id === id);
        return found ? { ...found } : null;
    } catch {
        const found = memoryMataKuliah.find((m) => m.id === id);
        return found ? { ...found } : null;
    }
}

export async function createMataKuliah(data: {
    kode: string;
    nama: string;
    sks?: number;
    dosen?: string;
    dosen_id?: number;
}): Promise<MataKuliah> {
    const dosenName = data.dosen || 'Dr. Budi Santoso, M.Kom.';
    const dosenId = data.dosen_id || 1;
    const sks = data.sks || 3;
    const now = new Date().toISOString();

    try {
        const query = `
            INSERT INTO mata_kuliah (kode, nama, dosen_id, created_at, updated_at)
            VALUES (?, ?, ?, NOW(), NOW())
        `;
        const [result]: any = await pool.execute(query, [data.kode, data.nama, dosenId]);
        const newId = Number(result.insertId);

        return {
            id: newId,
            kode: data.kode,
            nama: data.nama,
            sks,
            dosen: dosenName,
            dosen_id: dosenId,
            created_at: now,
            updated_at: now,
        };
    } catch {
        const maxId = memoryMataKuliah.reduce((max, item) => (item.id > max ? item.id : max), 0);
        const newMK: MataKuliah = {
            id: maxId + 1,
            kode: data.kode,
            nama: data.nama,
            sks,
            dosen: dosenName,
            dosen_id: dosenId,
            created_at: now,
            updated_at: now,
        };
        memoryMataKuliah.push(newMK);
        return { ...newMK };
    }
}

export async function updateMataKuliah(
    id: number,
    data: Partial<{ kode: string; nama: string; sks: number; dosen: string }>
): Promise<MataKuliah | null> {
    const existing = await getMataKuliahById(id);
    if (!existing) return null;

    const updatedKode = data.kode ?? existing.kode;
    const updatedNama = data.nama ?? existing.nama;
    const updatedSks = data.sks ?? existing.sks;
    const updatedDosen = data.dosen ?? existing.dosen;
    const now = new Date().toISOString();

    try {
        const query = `UPDATE mata_kuliah SET kode = ?, nama = ?, updated_at = NOW() WHERE id = ?`;
        await pool.execute(query, [updatedKode, updatedNama, id]);
        return {
            ...existing,
            kode: updatedKode,
            nama: updatedNama,
            sks: updatedSks,
            dosen: updatedDosen,
            updated_at: now,
        };
    } catch {
        const index = memoryMataKuliah.findIndex((m) => m.id === id);
        if (index === -1) return null;

        memoryMataKuliah[index] = {
            ...memoryMataKuliah[index],
            kode: updatedKode,
            nama: updatedNama,
            sks: updatedSks,
            dosen: updatedDosen,
            updated_at: now,
        };
        return { ...memoryMataKuliah[index] };
    }
}

export async function deleteMataKuliah(id: number): Promise<boolean> {
    try {
        const [res]: any = await pool.execute('DELETE FROM mata_kuliah WHERE id = ?', [id]);
        if (res.affectedRows > 0) return true;
        const index = memoryMataKuliah.findIndex((m) => m.id === id);
        if (index !== -1) {
            memoryMataKuliah.splice(index, 1);
            return true;
        }
        return false;
    } catch {
        const index = memoryMataKuliah.findIndex((m) => m.id === id);
        if (index === -1) return false;
        memoryMataKuliah.splice(index, 1);
        return true;
    }
}
