import { findMatches } from './matching.service.js';
import { requests } from '../data/demoData.js';

export function simulateOutreach(requestId: string) {
  const request = requests.find(r => r.id === requestId);
  if (!request) return null;
  const matches = findMatches(request.bloodGroup);
  return {
    requestId,
    mode: 'SIMULATION_ONLY',
    count: matches.length,
    recipients: matches.map(d => ({ donorId: d.id, displayName: d.name, channel: 'simulated', status: 'queued-demo' })),
    message: 'No SMS, phone call, or other real notification was sent.'
  };
}
