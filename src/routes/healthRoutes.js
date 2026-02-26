import { Router } from 'express';
import { getHealthController } from '../controllers/healthControllers/indexHealthController.js';

const router = Router();

// Health check endpoint
router.get('/health', getHealthController);

export default router;
