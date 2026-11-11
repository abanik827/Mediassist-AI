/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageView, Prescription, Reminder, Medication } from './types';
import { 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_REMINDERS, 
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

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [prescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription>(INITIAL_PRESCRIPTIONS[0]);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [initialVoiceQuestion, setInitialVoiceQuestion] = useState<string>('');

  // Reminder state management
  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, takenToday: !r.takenToday } : r))
    );
  };

  const handleAddReminder = (newReminder: Reminder) => {
    setReminders((prev) => [newReminder, ...prev]);
  };

  const handleEditReminder = (updatedReminder: Reminder) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === updatedReminder.id ? updatedReminder : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleResetAllToday = () => {
    setReminders((prev) => prev.map((r) => ({ ...r, takenToday: false })));
  };

  // Convert scanned medication directly into active reminder
  const handleAddMedicationToReminders = (med: Medication, doctorName: string) => {
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
      id: `rem-scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      medicineName: med.name,
      dosage: `${med.dosage} ${med.form}`,
      time: defaultTime,
      duration: med.duration,
      foodRelation: `${med.foodRelation} · ${med.instructions}`,
      takenToday: false,
      notes: `From prescription by ${doctorName}`,
    };

    setReminders((prev) => [newReminder, ...prev]);
  };

  const handleAddAllToReminders = (medications: Medication[], doctorName: string) => {
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
        dosage: `${med.dosage} ${med.form}`,
        time: timeStr,
        duration: med.duration,
        foodRelation: `${med.foodRelation} (${med.decodedFrequency})`,
        takenToday: false,
        notes: `Imported from ${doctorName}`,
      };
    });

    setReminders((prev) => [...newReminders, ...prev]);
  };

  const handleAskAi = (question: string) => {
    setInitialVoiceQuestion(question);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* 1-Row, 3-Zone Header */}
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        reminderCount={reminders.filter((r) => !r.takenToday).length}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage onNavigate={setCurrentPage} />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            prescriptions={prescriptions}
            reminders={reminders}
            onNavigate={setCurrentPage}
            onSelectPrescription={setSelectedPrescription}
            onToggleReminder={handleToggleReminder}
            onAskAi={handleAskAi}
          />
        )}

        {currentPage === 'scanner' && (
          <ScannerPage
            prescriptions={prescriptions}
            selectedPrescription={selectedPrescription}
            onSelectPrescription={setSelectedPrescription}
            onAddMedicationToReminders={handleAddMedicationToReminders}
            onAddAllToReminders={handleAddAllToReminders}
          />
        )}

        {currentPage === 'agents' && (
          <AgentsPage agents={INITIAL_AGENTS} />
        )}

        {currentPage === 'reminders' && (
          <RemindersPage
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onAddReminder={handleAddReminder}
            onEditReminder={handleEditReminder}
            onDeleteReminder={handleDeleteReminder}
            onResetAllToday={handleResetAllToday}
          />
        )}

        {currentPage === 'voice' && (
          <VoiceAssistantPage
            initialQuestion={initialVoiceQuestion}
            onClearInitialQuestion={() => setInitialVoiceQuestion('')}
          />
        )}
      </main>

      {/* Trust & Clinical Disclaimer Footer */}
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}
