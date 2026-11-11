import React, { useState, useEffect } from 'react';
import { Reminder } from '../../types';
import { X, Clock, Calendar, Pill } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: Reminder) => void;
  initialData?: Reminder | null;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [duration, setDuration] = useState('30 Days');
  const [foodRelation, setFoodRelation] = useState('Take with food');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setMedicineName(initialData.medicineName);
      setDosage(initialData.dosage);
      setTime(initialData.time);
      setDuration(initialData.duration);
      setFoodRelation(initialData.foodRelation);
      setNotes(initialData.notes || '');
    } else {
      setMedicineName('');
      setDosage('');
      setTime('08:00 AM');
      setDuration('30 Days');
      setFoodRelation('Take with food');
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim()) return;

    const reminderToSave: Reminder = {
      id: initialData ? initialData.id : `rem-${Date.now()}`,
      medicineName: medicineName.trim(),
      dosage: dosage.trim() || '1 Tablet',
      time,
      duration,
      foodRelation,
      takenToday: initialData ? initialData.takenToday : false,
      notes: notes.trim(),
      prescriptionId: initialData?.prescriptionId,
    };

    onSave(reminderToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {initialData ? 'Edit Medication Reminder' : 'Add Medication Reminder'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Medicine Name *
            </label>
            <input
              type="text"
              required
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="e.g. Lisinopril, Amoxicillin"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dosage & Form
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 10 mg Tablet"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reminder Time *
              </label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 08:00 AM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration as Prescribed *
              </label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 7 Days, 90 Days"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Food Instruction
              </label>
              <select
                value={foodRelation}
                onChange={(e) => setFoodRelation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Take with food">Take with food</option>
                <option value="Take after meals">Take after meals</option>
                <option value="Take before meals">Take before meals</option>
                <option value="Empty stomach">Empty stomach</option>
                <option value="Take with a full glass of water">With water</option>
                <option value="As needed for symptoms">As needed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinical Notes / Doctor Reference
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Take regularly at bedtime; avoid grapefruit"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {initialData ? 'Save Changes' : 'Confirm Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
