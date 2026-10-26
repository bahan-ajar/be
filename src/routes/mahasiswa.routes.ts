import { Router } from 'express';
import {
    getMahasiswaList,
    getMahasiswaDetail,
    createNewMahasiswa,
    updateExistingMahasiswa,
    deleteExistingMahasiswa,
} from '../controllers/mahasiswa.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getMahasiswaList);
router.get('/:id', getMahasiswaDetail);
router.post('/', authMiddleware, createNewMahasiswa);
router.put('/:id', authMiddleware, updateExistingMahasiswa);
router.patch('/:id', authMiddleware, updateExistingMahasiswa);
router.delete('/:id', authMiddleware, deleteExistingMahasiswa);

export default router;
