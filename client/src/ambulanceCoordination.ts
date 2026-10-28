
export interface Ambulance {
  id: string;
  vehicleNumber: string;
  available: boolean;
  distanceKm: number;
}

export interface AmbulanceAssignment {
  ambulance: Ambulance;
  requestId: string;
  status: "assigned";
}

export function assignNearestAmbulance(
  requestId: string,
  ambulances: Ambulance[],
): AmbulanceAssignment | null {
  const nearest = ambulances
    .filter((ambulance) => ambulance.available)
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];

  if (!nearest) return null;

  return {
    ambulance: nearest,
    requestId,
    status: "assigned",
  };
}
