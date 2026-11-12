import React, { useState } from 'react';
import { Reminder } from '../../types';
import { 
  Bell, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  Search,
  Check,
  RotateCcw,
  Eye
} from 'lucide-react';
import { ReminderModal } from '../modals/ReminderModal';

interface RemindersPageProps {
  reminders: Reminder[];
  isDemoMode?: boolean;
  onToggleReminder: (id: string) => void;
  onAddReminder: (reminder: Reminder) => void;
  onEditReminder: (reminder: Reminder) => void;
  onDeleteReminder: (id: string) => void;
  onResetAllToday: () => void;
  onToggleDemoMode?: () => void;
}

export const RemindersPage: React.FC<RemindersPageProps> = ({
  reminders,
  isDemoMode = false,
  onToggleReminder,
  onAddReminder,
  onEditReminder,
  onDeleteReminder,
  onResetAllToday,
  onToggleDemoMode,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');

  const handleOpenAdd = () => {
    setEditingReminder(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (rem: Reminder) => {
    setEditingReminder(rem);
    setModalOpen(true);
  };

  const handleSaveModal = (savedReminder: Reminder) => {
    if (editingReminder) {
      onEditReminder(savedReminder);
    } else {
      onAddReminder(savedReminder);
    }
  };

  const handleDelete = (id: string) => {
    onDeleteReminder(id);
    setDeleteConfirmId(null);
  };

  // Filtered list
  const filteredReminders = reminders.filter((r) => {
    const matchesSearch =
      r.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.dosage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.duration.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'pending') return !r.takenToday;
    if (filterMode === 'completed') return r.takenToday;
    return true;
  });

  const completedCount = reminders.filter((r) => r.takenToday).length;
  const totalCount = reminders.length;
  const adherenceRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider">
            <Bell className="w-4 h-4" />
            <span>Medication Adherence Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Prescription Reminders
          </h1>
          <p className="text-sm text-slate-500">
            User-confirmed dosage schedule with medicine name, time, and prescribed duration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {totalCount > 0 && (
            <button
              onClick={onResetAllToday}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset taken status for a new day"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Day</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            disabled={isDemoMode}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Reminder</span>
          </button>
        </div>
      </div>

      {/* Adherence Card Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Today's Adherence Rate
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold font-mono text-emerald-600 tabular-nums">
              {adherenceRate}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {completedCount} of {totalCount} doses confirmed taken
            </span>
          </div>
          <div className="w-full md:w-80 bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${adherenceRate}%` }}
            />
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reminder..."
              className="pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-48"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({reminders.length})
            </button>
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterMode === 'pending'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({reminders.filter((r) => !r.takenToday).length})
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterMode === 'completed'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {filteredReminders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {searchQuery ? 'No matching reminders found' : 'No medication reminders scheduled yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? 'Try a different search term or clear the filter.'
                : 'Upload and verify a prescription in the Scanner, or click "Add New Reminder" above to set a schedule.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenAdd}
                disabled={isDemoMode}
                className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
              >
                Add Custom Reminder
              </button>
            )}
          </div>
        ) : (
          filteredReminders.map((rem) => (
            <div
              key={rem.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                rem.takenToday
                  ? 'border-slate-200/80 bg-slate-50/60 opacity-85'
                  : 'border-slate-200 hover:border-emerald-300'
              }`}
            >
              {/* Left Zone: Checkbox & Name, Time, Duration */}
              <div className="flex items-start gap-4">
                <button
                  onClick={() => onToggleReminder(rem.id)}
                  disabled={isDemoMode}
                  className="mt-1 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none cursor-pointer shrink-0"
                  title={rem.takenToday ? 'Mark as pending' : 'Mark dose as taken'}
                >
                  {rem.takenToday ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-50" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`text-base font-bold ${
                        rem.takenToday ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {rem.medicineName}
                    </h3>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {rem.dosage}
                    </span>
                    {rem.takenToday && (
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Taken Today</span>
                      </span>
                    )}
                    {rem.isDemo && (
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Demo
                      </span>
                    )}
                  </div>

                  {/* Clean unboxed metadata with separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-emerald-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{rem.time}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Duration: <strong className="text-slate-700">{rem.duration}</strong></span>
                    </span>
                    {rem.foodRelation && (
                      <>
                        <span>·</span>
                        <span>{rem.foodRelation}</span>
                      </>
                    )}
                  </div>

                  {rem.notes && (
                    <p className="text-xs text-slate-500 italic pt-0.5">
                      Note: {rem.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Zone: Edit and Delete Controls */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                <button
                  onClick={() => onToggleReminder(rem.id)}
                  disabled={isDemoMode}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    rem.takenToday
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  {rem.takenToday ? 'Mark Pending' : 'Mark as Taken'}
                </button>

                <button
                  onClick={() => handleOpenEdit(rem)}
                  disabled={isDemoMode}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Edit reminder"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {deleteConfirmId === rem.id ? (
                  <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                    <button
                      onClick={() => handleDelete(rem.id)}
                      className="px-2 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100 rounded cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-200 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(rem.id)}
                    disabled={isDemoMode}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reminder Add/Edit Modal */}
      <ReminderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveModal}
        initialData={editingReminder}
      />
    </div>
  );
};
