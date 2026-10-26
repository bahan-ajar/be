import pool from '../config/db';
import { PresensiItem, PresensiStatus } from '../types';

const memoryPresensi: PresensiItem[] = [
    {
        id: 1,
        nim: '2101001',
        nama: 'Ahmad Fauzi',
        mataKuliah: 'Pemrograman Web Lanjut',
        tanggal: '2026-10-18',
        status: 'hadir',
    },
    {
        id: 2,
        nim: '2101002',
        nama: 'Dewi Lestari',
        mataKuliah: 'Pemrograman Web Lanjut',
        tanggal: '2026-10-18',
        status: 'hadir',
    },
    {
        id: 3,
        nim: '2101003',
        nama: 'Rian Pratama',
        mataKuliah: 'Basis Data Terdistribusi',
        tanggal: '2026-10-17',
        status: 'izin',
    },
    {
        id: 4,
        nim: '2101004',
        nama: 'Nadia Putri',
        mataKuliah: 'Kecerdasan Buatan',
        tanggal: '2026-10-17',
        status: 'sakit',
    },
];

export async function getAllPresensi(): Promise<PresensiItem[]> {
    try {
        const query = `
            SELECT a.id, m.nim, m.nama, mk.nama as mataKuliah,
                   DATE_FORMAT(a.tanggal, '%Y-%m-%d') as tanggal,
                   a.status, a.waktu
            FROM absensi a
            JOIN mahasiswa m ON a.mahasiswa_id = m.id
            JOIN mata_kuliah mk ON a.mata_kuliah_id = mk.id
            ORDER BY a.tanggal DESC, a.id DESC
        `;
        const [rows]: any = await pool.execute(query);
        if (rows && rows.length > 0) {
            return rows.map((r: any) => ({
                id: Number(r.id),
                nim: r.nim,
                nama: r.nama,
                mataKuliah: r.mataKuliah,
                tanggal: r.tanggal,
                status: (r.status === 'alfa' ? 'alpa' : r.status) as PresensiStatus,
                waktu: r.waktu,
            }));
        }
        return [...memoryPresensi];
    } catch {
        return [...memoryPresensi];
    }
}

export async function updatePresensiStatus(id: number, status: PresensiStatus): Promise<PresensiItem | null> {
    try {
        const dbStatus = status === 'alpa' ? 'alfa' : status;
        await pool.execute('UPDATE absensi SET status = ?, updated_at = NOW() WHERE id = ?', [dbStatus, id]);
        const index = memoryPresensi.findIndex((p) => p.id === id);
        if (index !== -1) {
            memoryPresensi[index].status = status;
            return { ...memoryPresensi[index] };
        }
        return null;
    } catch {
        const index = memoryPresensi.findIndex((p) => p.id === id);
        if (index === -1) return null;
        memoryPresensi[index].status = status;
        return { ...memoryPresensi[index] };
    }
}

export async function createPresensi(data: {
    nim: string;
    nama: string;
    mataKuliah: string;
    tanggal: string;
    status: PresensiStatus;
}): Promise<PresensiItem> {
    const maxId = memoryPresensi.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newItem: PresensiItem = {
        id: maxId + 1,
        ...data,
    };
    memoryPresensi.push(newItem);
    return { ...newItem };
}
