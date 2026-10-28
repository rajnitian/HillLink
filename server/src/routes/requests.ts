import { Router } from 'express';
import { requests, donors } from '../data/demoData.js';
import { findMatches } from '../services/matching.service.js';
import type { BloodGroup, EmergencyRequest } from '../types.js';

const router = Router();
const groups = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

router.get('/', (_req, res) => res.json(requests));
router.post('/', (req, res) => {
  const { patientLabel, hospital, location, bloodGroup, units, urgency } = req.body ?? {};
  if (![patientLabel, hospital, location, urgency].every(v => typeof v === 'string' && v.trim()) ||
      !groups.includes(bloodGroup) || !Number.isInteger(Number(units)) || Number(units) < 1 || Number(units) > 10) {
    return res.status(400).json({ error: 'Invalid request fields.' });
  }
  const created: EmergencyRequest = {
    id: `HL-${Date.now().toString().slice(-6)}`, patientLabel: patientLabel.trim(),
    hospital: hospital.trim(), location: location.trim(), bloodGroup: bloodGroup as BloodGroup,
    units: Number(units), urgency: urgency.trim(), createdAt: new Date().toISOString(), status: 'Matching'
  };
  requests.unshift(created);
  res.status(201).json(created);
});
router.get('/:id/matches', (req, res) => {
  const request = requests.find(r => r.id === req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found.' });
  return res.json(findMatches(request.bloodGroup));
});

export default router;
