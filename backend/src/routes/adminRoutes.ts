import { Router } from 'express';
import { 
  getPlatformStats, 
  getAllUsers, 
  updateUserRole, 
  deleteUser 
} from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

// Protect all routes with admin privileges
router.use(authenticate as any);
router.use(authorizeAdmin as any);

router.get('/stats', getPlatformStats as any);
router.get('/users', getAllUsers as any);
router.put('/users/role', updateUserRole as any);
router.delete('/users/:id', deleteUser as any);

export default router;
