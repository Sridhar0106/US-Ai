import { Router } from 'express';
import { register, login, getMe, googleLogin } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/me', authenticate as any, getMe as any);

export default router;
