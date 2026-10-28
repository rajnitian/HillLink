import type { Donor, EmergencyRequest } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function getRequests(): Promise<EmergencyRequest[]> {
  const res = await fetch(`${API}/requests`);
  if (!res.ok) throw new Error('Could not load requests');
  return res.json();
}
export async function getDonors(): Promise<Donor[]> {
  const res = await fetch(`${API}/donors`);
  if (!res.ok) throw new Error('Could not load donors');
  return res.json();
}
export async function createRequest(input: Omit<EmergencyRequest, 'id' | 'createdAt' | 'status'>) {
  const res = await fetch(`${API}/requests`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error('Could not create request');
  return res.json();
}
export async function getMatches(requestId: string): Promise<Donor[]> {
  const res = await fetch(`${API}/requests/${requestId}/matches`);
  if (!res.ok) throw new Error('Could not load matches');
  return res.json();
}
export async function simulateOutreach(requestId: string) {
  const res = await fetch(`${API}/notifications/outreach`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId })
  });
  if (!res.ok) throw new Error('Could not simulate outreach');
  return res.json();
}
