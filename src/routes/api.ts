import { Router } from 'express';
import authRoutes from './auth.routes';
import noteRoutes from './notes.routes';
import mataKuliahRoutes from './mata-kuliah.routes';
import mahasiswaRoutes from './mahasiswa.routes';
import presensiRoutes from './presensi.routes';
import dashboardRoutes from './dashboard.routes';
import { login, getMe, getAllUsers, deleteUser } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validateLogin } from '../middlewares/validator';

const router = Router();

// Modul Autentikasi (Pertemuan 9 – Langkah 1)
router.use('/auth', authRoutes);

// Modul Catatan & Mutasi Data (Pertemuan 10 – Langkah 7-10)
router.use('/notes', noteRoutes);

// Modul Data Akademik Terintegrasi (Mata Kuliah, Mahasiswa, Presensi, Dashboard)
router.use('/mata-kuliah', mataKuliahRoutes);
router.use('/mahasiswa', mahasiswaRoutes);
router.use('/presensi', presensiRoutes);
router.use('/dashboard', dashboardRoutes);

// Modul Pengguna dengan RBAC (Pertemuan 9 – Langkah 5)
// Hanya pengguna dengan role 'admin' yang dapat mengakses /api/users
router.get('/users', authMiddleware, requireAdmin, getAllUsers);
router.delete('/users/:id', authMiddleware, requireAdmin, deleteUser);

// Rute kompatibilitas ke belakang (Legacy endpoints)
router.post('/login', validateLogin, login);
router.get('/me', authMiddleware, getMe);

export default router;
