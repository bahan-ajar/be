import { Request, Response } from 'express';
import { getAllMahasiswa } from '../dal/mahasiswa.dal';
import { getAllMataKuliah } from '../dal/mata-kuliah.dal';
import { getAllPresensi } from '../dal/presensi.dal';

export async function getDashboardStats(req: Request, res: Response) {
    try {
        const [mahasiswaList, mkList, presensiList] = await Promise.all([
            getAllMahasiswa(),
            getAllMataKuliah(),
            getAllPresensi(),
        ]);

        const totalMahasiswa = mahasiswaList.length;
        const mahasiswaAktif = mahasiswaList.filter((m) => m.status === 'aktif').length;
        const totalMataKuliah = mkList.length;

        const totalPresensi = presensiList.length;
        const totalHadir = presensiList.filter((p) => p.status === 'hadir').length;
        const kehadiranRate = totalPresensi > 0 ? ((totalHadir / totalPresensi) * 100).toFixed(1) + '%' : '100%';

        res.status(200).json({
            success: true,
            data: [
                {
                    title: 'Total Mahasiswa',
                    value: totalMahasiswa.toString(),
                    subtext: '+4 mahasiswa terdata semester ini',
                    iconKey: 'users',
                },
                {
                    title: 'Mahasiswa Aktif',
                    value: mahasiswaAktif.toString(),
                    subtext: totalMahasiswa > 0 ? `${((mahasiswaAktif / totalMahasiswa) * 100).toFixed(1)}% tingkat keaktifan` : '100%',
                    iconKey: 'userCheck',
                },
                {
                    title: 'Mata Kuliah',
                    value: totalMataKuliah.toString(),
                    subtext: 'Tersebar di semester aktif',
                    iconKey: 'bookOpen',
                },
                {
                    title: 'Rata-rata Kehadiran',
                    value: kehadiranRate,
                    subtext: 'Berdasarkan absensi terkini',
                    iconKey: 'checkCircle',
                },
            ],
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil statistik dashboard',
        });
    }
}

export async function getRecentStudents(req: Request, res: Response) {
    try {
        const mahasiswaList = await getAllMahasiswa();
        // Return 4 most recent students
        const recent = [...mahasiswaList].reverse().slice(0, 4);

        res.status(200).json({
            success: true,
            data: recent,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data mahasiswa terbaru',
        });
    }
}
