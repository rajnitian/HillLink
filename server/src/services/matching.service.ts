import { donors } from '../data/demoData.js';
import type { BloodGroup, Donor } from '../types.js';

// Prototype compatibility rules for demo ranking only. Clinical compatibility must be
// validated by qualified medical staff and the blood bank before any real use.
const compatible: Record<BloodGroup, BloodGroup[]> = {
  'O-':['O-'], 'O+':['O+','O-'], 'A-':['A-','O-'], 'A+':['A+','A-','O+','O-'],
  'B-':['B-','O-'], 'B+':['B+','B-','O+','O-'], 'AB-':['AB-','A-','B-','O-'],
  'AB+':['AB+','AB-','A+','A-','B+','B-','O+','O-']
};
export function findMatches(group: BloodGroup): Donor[] {
  return donors.filter(d => d.available && compatible[group].includes(d.bloodGroup))
    .sort((a,b) => a.travelMinutes - b.travelMinutes).slice(0,5);
}
