export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type RequestStatus = 'Critical' | 'Matching' | 'Donor confirmed' | 'Transport arranged';
export interface Donor {
  id: string; name: string; bloodGroup: BloodGroup; location: string;
  travelMinutes: number; available: boolean; lastVerified: string;
}
export interface EmergencyRequest {
  id: string; patientLabel: string; hospital: string; location: string;
  bloodGroup: BloodGroup; units: number; urgency: string; createdAt: string; status: RequestStatus;
}
