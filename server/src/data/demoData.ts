import type { Donor, EmergencyRequest } from '../types.js';

export const donors: Donor[] = [
  {id:'D-101',name:'Aarav T.',bloodGroup:'O+',location:'Itanagar',travelMinutes:18,available:true,lastVerified:'Demo record'},
  {id:'D-102',name:'Mira K.',bloodGroup:'A+',location:'Naharlagun',travelMinutes:27,available:true,lastVerified:'Demo record'},
  {id:'D-103',name:'Dev P.',bloodGroup:'O-',location:'Nirjuli',travelMinutes:35,available:true,lastVerified:'Demo record'},
  {id:'D-104',name:'Nima S.',bloodGroup:'B+',location:'Itanagar',travelMinutes:22,available:true,lastVerified:'Demo record'},
  {id:'D-105',name:'Tashi R.',bloodGroup:'O+',location:'Doimukh',travelMinutes:46,available:false,lastVerified:'Demo record'},
  {id:'D-106',name:'Ishita M.',bloodGroup:'AB+',location:'Naharlagun',travelMinutes:31,available:true,lastVerified:'Demo record'},
  {id:'D-107',name:'Karan B.',bloodGroup:'O+',location:'Nirjuli',travelMinutes:39,available:true,lastVerified:'Demo record'},
  {id:'D-108',name:'Pema L.',bloodGroup:'B-',location:'Itanagar',travelMinutes:16,available:false,lastVerified:'Demo record'},
  {id:'D-109',name:'Rohan D.',bloodGroup:'A-',location:'Naharlagun',travelMinutes:24,available:true,lastVerified:'Demo record'},
  {id:'D-110',name:'Anaya C.',bloodGroup:'O+',location:'Itanagar',travelMinutes:12,available:true,lastVerified:'Demo record'}
];

export const requests: EmergencyRequest[] = [
  {id:'HL-2048',patientLabel:'Demo patient A',hospital:'Himalayan District Hospital',location:'Itanagar, Arunachal Pradesh',bloodGroup:'O+',units:2,urgency:'Critical',createdAt:new Date().toISOString(),status:'Critical'},
  {id:'HL-2047',patientLabel:'Demo patient B',hospital:'Valley Community Hospital',location:'Naharlagun, Arunachal Pradesh',bloodGroup:'A+',units:1,urgency:'Urgent',createdAt:new Date().toISOString(),status:'Matching'},
  {id:'HL-2046',patientLabel:'Demo patient C',hospital:'Regional Medical Centre',location:'Nirjuli, Arunachal Pradesh',bloodGroup:'B+',units:3,urgency:'Urgent',createdAt:new Date().toISOString(),status:'Donor confirmed'}
];
