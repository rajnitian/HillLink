
export type BloodGroup =
  | "A+" | "A-" | "B+" | "B-"
  | "AB+" | "AB-" | "O+" | "O-";

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  available: boolean;
  distanceKm: number;
}

export interface BloodRequest {
  id: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  urgency: "normal" | "urgent" | "critical";
}

const compatibleDonors: Record<BloodGroup, BloodGroup[]> = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  "AB-": ["A-", "B-", "AB-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"],
};

export function findMatchingDonors(
  request: BloodRequest,
  donors: Donor[],
): Donor[] {
  if (request.unitsNeeded < 1) return [];

  return donors
    .filter(
      (donor) =>
        donor.available &&
        compatibleDonors[request.bloodGroup].includes(donor.bloodGroup),
    )
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
