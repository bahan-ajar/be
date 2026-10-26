import { Router } from 'express';
import {
    getPresensiList,
    updateExistingPresensiStatus,
    createNewPresensi,
} from '../controllers/presensi.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getPresensiList);
router.patch('/:id', authMiddleware, updateExistingPresensiStatus);
router.put('/:id', authMiddleware, updateExistingPresensiStatus);
router.post('/', authMiddleware, createNewPresensi);

export default router;
