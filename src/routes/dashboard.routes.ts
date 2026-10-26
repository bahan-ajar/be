import { Router } from 'express';
import { getDashboardStats, getRecentStudents } from '../controllers/dashboard.controller';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/recent-students', getRecentStudents);

export default router;
