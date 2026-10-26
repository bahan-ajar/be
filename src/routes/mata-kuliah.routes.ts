import { Router } from 'express';
import {
    getMataKuliahList,
    getMataKuliahDetail,
    createNewMataKuliah,
    updateExistingMataKuliah,
    deleteExistingMataKuliah,
} from '../controllers/mata-kuliah.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getMataKuliahList);
router.get('/:id', getMataKuliahDetail);
router.post('/', authMiddleware, createNewMataKuliah);
router.put('/:id', authMiddleware, updateExistingMataKuliah);
router.patch('/:id', authMiddleware, updateExistingMataKuliah);
router.delete('/:id', authMiddleware, deleteExistingMataKuliah);

export default router;
