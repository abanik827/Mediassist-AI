export type PageView = 'landing' | 'dashboard' | 'scanner' | 'agents' | 'reminders' | 'voice';

export interface ExtractedPrescriptionItem {
  id: string;
  medicine_name_as_written: string;
  dosage_as_written: string | null;
  frequency_as_written: string | null;
  timing_as_written: string | null;
  duration_as_written: string | null;
  additional_instructions_as_written: string | null;
  is_uncertain?: boolean;
}

export interface ExtractedPrescriptionData {
  doctor_name: string | null;
  patient_name: string | null;
  clinic_name: string | null;
  prescription_date: string | null;
  medications: ExtractedPrescriptionItem[];
  uncertain_or_unreadable_fields: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  form?: string;
  frequency: string;
  latinAbbr?: string;
  decodedFrequency?: string;
  duration: string;
  timing?: string;
  foodRelation?: string;
  instructions: string;
  precautions?: string[];
  purpose?: string;
  isUncertain?: boolean;
}

export interface Prescription {
  id: string;
  title: string;
  doctorName: string | null;
  specialty?: string | null;
  clinic: string | null;
  date: string | null;
  patientName: string | null;
  patientAge?: number | null;
  diagnosisNote?: string | null;
  medications: Medication[];
  status: 'User Scanned' | 'Pending Verification' | 'Demonstration Sample' | string;
  imagePlaceholderText?: string;
  sampleType?: 'Custom Scan' | 'Cardiology' | 'Infection' | 'Endocrine' | 'Respiratory';
  customImageUrl?: string;
  uploadedFileName?: string;
  humanVerified?: boolean;
  uncertainFields?: string[];
  isDemo?: boolean;
}

export interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  time: string; // e.g. "08:00 AM"
  duration: string; // e.g. "7 Days", "30 Days", "Ongoing"
  foodRelation?: string;
  takenToday: boolean;
  notes?: string;
  prescriptionId?: string;
  humanConfirmed?: boolean;
  isDemo?: boolean;
}

export type AgentStatus = 'Ready' | 'Active' | 'Processing' | 'Standby' | 'Awaiting Scan';

export interface AIAgent {
  id: string;
  name: string;
  shortRole: string;
  description: string;
  responsibilities: string[];
  inputData: string;
  outputArtifact: string;
  status: AgentStatus;
  stepNumber: number;
}

export interface AgentReport {
  agentNumber: number;
  agentName: string;
  finding: string;
  status: string;
}

export interface VoiceMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioAvailable?: boolean;
  source?: string;
}
