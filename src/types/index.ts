import { RowDataPacket } from 'mysql2';

export type UserRole = 'admin' | 'member';

export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    role?: UserRole;
    created_at?: Date | string;
    updated_at?: Date | string;
}

export interface UserRow extends RowDataPacket, User {}

export interface JwtUserPayload {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}

export interface Note {
    id: number;
    title: string;
    content: string;
    category: string;
    priority: number;
    userId: number;
    authorName?: string;
    created_at: string;
    updated_at: string;
}

export interface MataKuliah {
    id: number;
    kode: string;
    nama: string;
    sks: number;
    dosen_id?: number;
    dosen: string;
    created_at?: string;
    updated_at?: string;
}

export interface Mahasiswa {
    id: number;
    nim: string;
    nama: string;
    kelas: string;
    status: 'aktif' | 'cuti';
    created_at: string;
    updated_at?: string;
}

export type PresensiStatus = 'hadir' | 'izin' | 'sakit' | 'alpa';

export interface PresensiItem {
    id: number;
    nim: string;
    nama: string;
    mataKuliah: string;
    tanggal: string;
    status: PresensiStatus;
    waktu?: string;
}

export interface DashboardStatsData {
    totalMahasiswa: number;
    mahasiswaAktif: number;
    totalMataKuliah: number;
    rataRataKehadiran: string;
}
