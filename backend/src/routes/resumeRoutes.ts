import { Router } from 'express';
import { 
  uploadAndAnalyzeResume, 
  getUserResumes, 
  deleteResume 
} from '../controllers/resumeController';
import { authenticate } from '../middleware/auth';
import { uploadResume } from '../middleware/upload';

const router = Router();

router.use(authenticate as any);

router.post('/upload', uploadResume, uploadAndAnalyzeResume as any);
router.get('/user', getUserResumes as any);
router.delete('/:id', deleteResume as any);

export default router;
