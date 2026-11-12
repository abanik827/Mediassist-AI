/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageView, Prescription, Reminder, Medication, AgentReport } from './types';
import { 
  DEMO_PRESCRIPTIONS, 
  DEMO_REMINDERS, 
  INITIAL_AGENTS 
} from './data/sampleData';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/pages/LandingPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { ScannerPage } from './components/pages/ScannerPage';
import { AgentsPage } from './components/pages/AgentsPage';
import { RemindersPage } from './components/pages/RemindersPage';
import { VoiceAssistantPage } from './components/pages/VoiceAssistantPage';
import { AlertCircle, Eye, LogOut } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // User Real Prescriptions: Begins empty by default
  const [userPrescriptions, setUserPrescriptions] = useState<Prescription[]>(() => {
    try {
      const saved = localStorage.getItem('mediassist_real_prescriptions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not read user prescriptions from storage', e);
    }
    return [];
  });

  // User Real Reminders: Begins empty by default
  const [userReminders, setUserReminders] = useState<Reminder[]>(() => {
    try {
      const saved = localStorage.getItem('mediassist_real_reminders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not read user reminders from storage', e);
    }
    return [];
  });

  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(() => {
    return userPrescriptions.length > 0 ? userPrescriptions[0] : null;
  });

  const [latestAgentReports, setLatestAgentReports] = useState<AgentReport[]>([]);
  const [initialVoiceQuestion, setInitialVoiceQuestion] = useState<string>('');

  // Persist User Prescriptions
  useEffect(() => {
    try {
      localStorage.setItem('mediassist_real_prescriptions', JSON.stringify(userPrescriptions));
    } catch (e) {
      console.warn('Could not persist prescriptions to storage', e);
    }
  }, [userPrescriptions]);

  // Persist User Reminders
  useEffect(() => {
    try {
      localStorage.setItem('mediassist_real_reminders', JSON.stringify(userReminders));
    } catch (e) {
      console.warn('Could not persist reminders to storage', e);
    }
  }, [userReminders]);

  // Active records based on whether Demo Mode is enabled
  const activePrescriptions = isDemoMode ? DEMO_PRESCRIPTIONS : userPrescriptions;
  const activeReminders = isDemoMode ? DEMO_REMINDERS : userReminders;

  // Toggle Reminder state
  const handleToggleReminder = (id: string) => {
    if (isDemoMode) return;
    setUserReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, takenToday: !r.takenToday } : r))
    );
  };

  const handleAddReminder = (newReminder: Reminder) => {
    if (isDemoMode) return;
    setUserReminders((prev) => [newReminder, ...prev]);
  };

  const handleEditReminder = (updatedReminder: Reminder) => {
    if (isDemoMode) return;
    setUserReminders((prev) =>
      prev.map((r) => (r.id === updatedReminder.id ? updatedReminder : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    if (isDemoMode) return;
    setUserReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleResetAllToday = () => {
    if (isDemoMode) return;
    setUserReminders((prev) => prev.map((r) => ({ ...r, takenToday: false })));
  };

  // Human-Verified Medication Schedule Conversion
  const handleAddMedicationToReminders = (med: Medication, doctorName: string | null) => {
    if (isDemoMode) return;
    const defaultTime =
      med.timing === 'Morning'
        ? '08:00 AM'
        : med.timing === 'Afternoon'
        ? '01:00 PM'
        : med.timing === 'Evening'
        ? '07:00 PM'
        : med.timing === 'Bedtime'
        ? '10:00 PM'
        : '09:00 AM';

    const newReminder: Reminder = {
      id: `rem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      medicineName: med.name,
      dosage: med.dosage || 'As prescribed',
      time: defaultTime,
      duration: med.duration || 'As directed',
      foodRelation: med.foodRelation || med.instructions || 'As instructed by doctor',
      takenToday: false,
      notes: doctorName ? `Prescribed by ${doctorName}` : 'From scanned prescription document',
      humanConfirmed: true,
      isDemo: false,
    };

    setUserReminders((prev) => [newReminder, ...prev]);
  };

  const handleAddAllToReminders = (medications: Medication[], doctorName: string | null) => {
    if (isDemoMode) return;
    const newReminders: Reminder[] = medications.map((med, idx) => {
      let timeStr = '08:00 AM';
      if (med.timing === 'Twice daily') {
        timeStr = idx % 2 === 0 ? '08:00 AM' : '08:00 PM';
      } else if (med.timing === 'Bedtime') {
        timeStr = '10:00 PM';
      } else if (med.timing === 'Evening') {
        timeStr = '07:00 PM';
      }

      return {
        id: `rem-bulk-${Date.now()}-${idx}`,
        medicineName: med.name,
        dosage: med.dosage || 'As prescribed',
        time: timeStr,
        duration: med.duration || 'As directed',
        foodRelation: med.instructions || 'As instructed by doctor',
        takenToday: false,
        notes: doctorName ? `Prescribed by ${doctorName}` : 'From verified prescription document',
        humanConfirmed: true,
        isDemo: false,
      };
    });

    setUserReminders((prev) => [...newReminders, ...prev]);
  };

  // Save freshly extracted genuine prescription
  const handleSaveNewPrescription = (newRx: Prescription) => {
    setUserPrescriptions((prev) => [newRx, ...prev.filter((p) => p.id !== newRx.id)]);
    setSelectedPrescription(newRx);
    if (isDemoMode) {
      setIsDemoMode(false); // Automatically switch to user mode when an actual scan completes
    }
  };

  const handleClearAllUserData = () => {
    localStorage.removeItem('mediassist_real_prescriptions');
    localStorage.removeItem('mediassist_real_reminders');
    setUserPrescriptions([]);
    setUserReminders([]);
    setSelectedPrescription(null);
    setLatestAgentReports([]);
  };

  const handleToggleDemoMode = () => {
    if (isDemoMode) {
      setIsDemoMode(false);
      setSelectedPrescription(userPrescriptions[0] || null);
    } else {
      setIsDemoMode(true);
      setSelectedPrescription(DEMO_PRESCRIPTIONS[0]);
    }
  };

  const handleAskAi = (question: string) => {
    setInitialVoiceQuestion(question);
  };

  const activeMedications = selectedPrescription?.medications || (activePrescriptions[0]?.medications ?? []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Optional Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between border-b border-amber-600 shadow-xs">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <Eye className="w-4 h-4 text-slate-950 shrink-0" />
            <span>
              <strong>DEMO MODE ACTIVE:</strong> You are currently viewing synthetic demonstration records. No actual patient or physician information is active.
            </span>
          </div>
          <button
            onClick={handleToggleDemoMode}
            className="px-3 py-1 bg-slate-950 text-white rounded-md text-[11px] font-bold hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-3 flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Demo Mode</span>
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        reminderCount={activeReminders.filter((r) => !r.takenToday).length}
      />

      {/* Main Content */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onNavigate={setCurrentPage}
            onToggleDemoMode={handleToggleDemoMode}
            isDemoMode={isDemoMode}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            prescriptions={activePrescriptions}
            reminders={activeReminders}
            isDemoMode={isDemoMode}
            onNavigate={setCurrentPage}
            onSelectPrescription={setSelectedPrescription}
            onToggleReminder={handleToggleReminder}
            onAskAi={handleAskAi}
            onToggleDemoMode={handleToggleDemoMode}
            onClearData={handleClearAllUserData}
          />
        )}

        {currentPage === 'scanner' && (
          <ScannerPage
            prescriptions={activePrescriptions}
            selectedPrescription={selectedPrescription}
            isDemoMode={isDemoMode}
            onSelectPrescription={setSelectedPrescription}
            onAddMedicationToReminders={handleAddMedicationToReminders}
            onAddAllToReminders={handleAddAllToReminders}
            onSaveNewPrescription={handleSaveNewPrescription}
            onAgentReportsUpdated={setLatestAgentReports}
            onToggleDemoMode={handleToggleDemoMode}
          />
        )}

        {currentPage === 'agents' && (
          <AgentsPage
            agents={INITIAL_AGENTS}
            prescriptions={activePrescriptions}
            latestReports={latestAgentReports}
            isDemoMode={isDemoMode}
          />
        )}

        {currentPage === 'reminders' && (
          <RemindersPage
            reminders={activeReminders}
            isDemoMode={isDemoMode}
            onToggleReminder={handleToggleReminder}
            onAddReminder={handleAddReminder}
            onEditReminder={handleEditReminder}
            onDeleteReminder={handleDeleteReminder}
            onResetAllToday={handleResetAllToday}
            onToggleDemoMode={handleToggleDemoMode}
          />
        )}

        {currentPage === 'voice' && (
          <VoiceAssistantPage
            initialQuestion={initialVoiceQuestion}
            onClearInitialQuestion={() => setInitialVoiceQuestion('')}
            activeMedications={activeMedications}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}
