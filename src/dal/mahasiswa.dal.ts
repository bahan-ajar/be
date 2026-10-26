import pool from '../config/db';
import { Mahasiswa } from '../types';

const memoryMahasiswa: Mahasiswa[] = [
    {
        id: 1,
        nim: '2101001',
        nama: 'Ahmad Fauzi',
        kelas: 'TI-3A',
        status: 'aktif',
        created_at: '12 Jan 2026',
    },
    {
        id: 2,
        nim: '2101002',
        nama: 'Dewi Lestari',
        kelas: 'TI-3A',
        status: 'aktif',
        created_at: '14 Jan 2026',
    },
    {
        id: 3,
        nim: '2101003',
        nama: 'Rian Pratama',
        kelas: 'TI-3B',
        status: 'aktif',
        created_at: '15 Jan 2026',
    },
    {
        id: 4,
        nim: '2101004',
        nama: 'Nadia Putri',
        kelas: 'TI-3B',
        status: 'cuti',
        created_at: '16 Jan 2026',
    },
];

export async function getAllMahasiswa(): Promise<Mahasiswa[]> {
    try {
        const [rows]: any = await pool.execute('SELECT * FROM mahasiswa ORDER BY id ASC');
        if (rows && rows.length > 0) {
            return rows.map((r: any) => ({
                id: Number(r.id),
                nim: r.nim,
                nama: r.nama,
                kelas: r.kelas,
                status: r.status,
                created_at: r.created_at
                    ? new Date(r.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                      })
                    : '12 Jan 2026',
            }));
        }
        return [...memoryMahasiswa];
    } catch {
        return [...memoryMahasiswa];
    }
}

export async function getMahasiswaById(id: number): Promise<Mahasiswa | null> {
    try {
        const [rows]: any = await pool.execute('SELECT * FROM mahasiswa WHERE id = ? LIMIT 1', [id]);
        if (rows && rows.length > 0) {
            const r = rows[0];
            return {
                id: Number(r.id),
                nim: r.nim,
                nama: r.nama,
                kelas: r.kelas,
                status: r.status,
                created_at: r.created_at
                    ? new Date(r.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                      })
                    : '12 Jan 2026',
            };
        }
        const found = memoryMahasiswa.find((m) => m.id === id);
        return found ? { ...found } : null;
    } catch {
        const found = memoryMahasiswa.find((m) => m.id === id);
        return found ? { ...found } : null;
    }
}

export async function createMahasiswa(data: {
    nim: string;
    nama: string;
    kelas: string;
    status: 'aktif' | 'cuti';
}): Promise<Mahasiswa> {
    const formattedDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    try {
        const query = `
            INSERT INTO mahasiswa (nim, nama, kelas, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, NOW(), NOW())
        `;
        const [res]: any = await pool.execute(query, [data.nim, data.nama, data.kelas, data.status]);
        return {
            id: Number(res.insertId),
            nim: data.nim,
            nama: data.nama,
            kelas: data.kelas,
            status: data.status,
            created_at: formattedDate,
        };
    } catch {
        const maxId = memoryMahasiswa.reduce((max, m) => (m.id > max ? m.id : max), 0);
        const newItem: Mahasiswa = {
            id: maxId + 1,
            nim: data.nim,
            nama: data.nama,
            kelas: data.kelas,
            status: data.status,
            created_at: formattedDate,
        };
        memoryMahasiswa.push(newItem);
        return { ...newItem };
    }
}

export async function updateMahasiswa(
    id: number,
    data: Partial<{ nim: string; nama: string; kelas: string; status: 'aktif' | 'cuti' }>
): Promise<Mahasiswa | null> {
    const existing = await getMahasiswaById(id);
    if (!existing) return null;

    const nim = data.nim ?? existing.nim;
    const nama = data.nama ?? existing.nama;
    const kelas = data.kelas ?? existing.kelas;
    const status = data.status ?? existing.status;

    try {
        await pool.execute(
            'UPDATE mahasiswa SET nim = ?, nama = ?, kelas = ?, status = ?, updated_at = NOW() WHERE id = ?',
            [nim, nama, kelas, status, id]
        );
        return {
            ...existing,
            nim,
            nama,
            kelas,
            status,
        };
    } catch {
        const index = memoryMahasiswa.findIndex((m) => m.id === id);
        if (index === -1) return null;
        memoryMahasiswa[index] = {
            ...memoryMahasiswa[index],
            nim,
            nama,
            kelas,
            status,
        };
        return { ...memoryMahasiswa[index] };
    }
}

export async function deleteMahasiswa(id: number): Promise<boolean> {
    try {
        const [res]: any = await pool.execute('DELETE FROM mahasiswa WHERE id = ?', [id]);
        if (res.affectedRows > 0) return true;
        const index = memoryMahasiswa.findIndex((m) => m.id === id);
        if (index !== -1) {
            memoryMahasiswa.splice(index, 1);
            return true;
        }
        return false;
    } catch {
        const index = memoryMahasiswa.findIndex((m) => m.id === id);
        if (index === -1) return false;
        memoryMahasiswa.splice(index, 1);
        return true;
    }
}
