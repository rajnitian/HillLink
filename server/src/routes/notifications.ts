import { Router } from 'express';
import { simulateOutreach } from '../services/notification.service.js';

const router = Router();
router.post('/outreach', (req, res) => {
  const { requestId } = req.body ?? {};
  if (typeof requestId !== 'string' || !requestId) return res.status(400).json({ error: 'requestId is required.' });
  const result = simulateOutreach(requestId);
  if (!result) return res.status(404).json({ error: 'Request not found.' });
  return res.json(result);
});
export default router;
