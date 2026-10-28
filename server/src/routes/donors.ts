import { Router } from 'express';
import { donors } from '../data/demoData.js';

const router = Router();
router.get('/', (_req, res) => res.json(donors));
export default router;
