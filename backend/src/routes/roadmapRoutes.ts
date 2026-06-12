import { Router } from 'express';
import { 
  createRoadmap, 
  getUserRoadmaps, 
  updateRoadmapProgress 
} from '../controllers/roadmapController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate as any);

router.post('/', createRoadmap as any);
router.get('/', getUserRoadmaps as any);
router.put('/:roadmapId/resource/:resourceId', updateRoadmapProgress as any);

export default router;
