import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint Registrasi Pengguna Baru
router.post('/register', register);

// Endpoint Login
router.post('/login', login);

// Endpoint Logout (Cabut cookie dan sesi)
router.post('/logout', logout);

// Endpoint Mendapatkan Profil Pengguna yang Sedang Login
router.get('/me', authMiddleware, getMe);

export default router;
