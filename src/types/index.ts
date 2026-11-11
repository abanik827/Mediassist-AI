export type PageView = 'landing' | 'dashboard' | 'scanner' | 'agents' | 'reminders' | 'voice';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Inhaler' | 'Injection' | 'Drops';
  frequency: string;
  latinAbbr?: string;
  decodedFrequency: string;
  duration: string;
  timing: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime' | 'Twice daily' | 'Thrice daily';
  foodRelation: 'Before meals' | 'With food' | 'After meals' | 'Empty stomach' | 'As needed';
  instructions: string;
  precautions: string[];
  purpose: string;
}

export interface Prescription {
  id: string;
  title: string;
  doctorName: string;
  specialty: string;
  clinic: string;
  date: string;
  patientName: string;
  patientAge: number;
  diagnosisNote?: string;
  medications: Medication[];
  status: 'Verified' | 'Pending Review' | 'Flagged Warning';
  imagePlaceholderText: string;
  sampleType: 'Cardiology' | 'Infection' | 'Endocrine' | 'Respiratory';
}

export interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  time: string; // e.g. "08:00 AM"
  duration: string; // e.g. "7 Days", "30 Days", "Ongoing"
  foodRelation: string;
  takenToday: boolean;
  notes?: string;
  prescriptionId?: string;
}

export type AgentStatus = 'Ready' | 'Active' | 'Processing' | 'Standby';

export interface AIAgent {
  id: string;
  name: string;
  shortRole: string;
  description: string;
  responsibilities: string[];
  inputData: string;
  outputArtifact: string;
  status: AgentStatus;
  confidenceScore: number;
  stepNumber: number;
}

export interface VoiceMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioAvailable?: boolean;
}
