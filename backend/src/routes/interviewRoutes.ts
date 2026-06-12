import { Router } from 'express';
import { 
  startInterview, 
  submitAnswer, 
  submitFollowUpAnswer,
  finishInterview, 
  getInterview, 
  getUserInterviews 
} from '../controllers/interviewController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate as any);

router.post('/start', startInterview as any);
router.post('/answer', submitAnswer as any);
router.post('/followup', submitFollowUpAnswer as any);
router.post('/finalize', finishInterview as any);
router.get('/user', getUserInterviews as any);
router.get('/:id', getInterview as any);

export default router;
