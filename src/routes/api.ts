import { Router } from 'express';
import { login, getMe } from '../controllers/authController';
import { validateLogin } from '../middlewares/validator';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * Route: POST /api/login
 * Middleware: validateLogin (validasi email/username dan password)
 * Controller: login
 */
router.post('/login', validateLogin, login);

/**
 * Route: GET /api/me
 * Middleware: authMiddleware (mengekstrak JWT dan menyimpan userId ke res.locals.userId)
 * Controller: getMe
 */
router.get('/me', authMiddleware, getMe);

export default router;
