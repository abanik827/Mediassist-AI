import React, { useState } from 'react';
import { PageView, Prescription, Reminder } from '../../types';
import { 
  Upload, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Send, 
  Pill, 
  ChevronRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Eye,
  Trash2,
  FilePlus2
} from 'lucide-react';

interface DashboardPageProps {
  prescriptions: Prescription[];
  reminders: Reminder[];
  isDemoMode: boolean;
  onNavigate: (page: PageView) => void;
  onSelectPrescription: (prescription: Prescription) => void;
  onToggleReminder: (reminderId: string) => void;
  onAskAi: (question: string) => void;
  onToggleDemoMode: () => void;
  onClearData: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  prescriptions,
  reminders,
  isDemoMode,
  onNavigate,
  onSelectPrescription,
  onToggleReminder,
  onAskAi,
  onToggleDemoMode,
  onClearData,
}) => {
  const [quickQuery, setQuickQuery] = useState('');

  const completedCount = reminders.filter((r) => r.takenToday).length;
  const totalReminders = reminders.length;
  const adherenceRate = totalReminders > 0 ? Math.round((completedCount / totalReminders) * 100) : 0;

  // Derive unique patient name if any extracted prescription contains one
  const detectedPatientName = prescriptions.find((p) => p.patientName)?.patientName || null;
  const uniqueClinicsCount = new Set(prescriptions.map((p) => p.clinic).filter(Boolean)).size;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    onAskAi(quickQuery);
    onNavigate('voice');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Welcome Section (No hardcoded fictional Sarah Jenkins) */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Prescription Transcription & Organization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {detectedPatientName ? `Welcome, ${detectedPatientName}` : 'Welcome to MediAssist AI'}
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            {prescriptions.length === 0
              ? 'Upload a doctor prescription image to transcribe handwritten instructions and organize your daily medication schedule.'
              : 'Your verified prescription records and daily medication reminders organized in one place.'}
          </p>
        </div>

        {/* Quick Prescription Upload Action Card */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('scanner')}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-emerald-200" />
            <span>Upload New Prescription</span>
          </button>
          
          <button
            onClick={onToggleDemoMode}
            className={`px-4 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
              isDemoMode
                ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isDemoMode ? 'Demo Mode Active' : 'Explore Demo Mode'}</span>
          </button>
        </div>
      </div>

      {/* Metric Counters (Derived purely from actual state, starting at zero) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Prescriptions On File</div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {prescriptions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-slate-700 font-medium">
              {uniqueClinicsCount} {uniqueClinicsCount === 1 ? 'Clinic' : 'Clinics'}
            </span>
            <span>·</span>
            <span>{isDemoMode ? 'Synthetic' : 'User Uploads'}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Active Reminders</div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {totalReminders}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-slate-700 font-medium">{completedCount} Taken</span>
            <span>·</span>
            <span>{totalReminders - completedCount} Pending</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Today's Adherence</div>
          <div className="text-3xl font-extrabold text-emerald-600 tabular-nums">
            {adherenceRate}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${adherenceRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Human Verification</div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {reminders.filter((r) => r.humanConfirmed).length} / {totalReminders}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-700 font-medium">User Confirmed</span>
            <span>·</span>
            <span>Safety Checked</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Recent Prescriptions + AI Assistant) & Right Column (Upcoming Reminders) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Recent Prescriptions + AI Assistant */}
        <div className="lg:col-span-8 space-y-8">
          {/* Recent Prescriptions Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {isDemoMode ? 'Demonstration Prescriptions (Sample Data)' : 'Your Prescriptions'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isDemoMode
                    ? 'Fictional educational records for testing UI capabilities.'
                    : 'Actual documents uploaded and transcribed by MediAssist AI.'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('scanner')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Scan Document</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {prescriptions.length === 0 ? (
              /* Clean Empty State */
              <div className="p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <FilePlus2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No prescriptions uploaded yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Upload an image or document of your doctor's prescription to transcribe medication names, dosage rules, and instructions.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => onNavigate('scanner')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Upload Prescription
                  </button>
                  <button
                    onClick={onToggleDemoMode}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
                  >
                    Explore Sample Prescriptions
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {prescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    onClick={() => {
                      onSelectPrescription(rx);
                      onNavigate('scanner');
                    }}
                    className="p-5 hover:bg-slate-50/80 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {rx.title || 'Scanned Prescription'}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                          rx.isDemo
                            ? 'text-amber-800 bg-amber-50 border-amber-200'
                            : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                        }`}>
                          {rx.status || 'Extracted'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        {rx.doctorName && (
                          <>
                            <span className="font-medium text-slate-700">{rx.doctorName}</span>
                            <span>·</span>
                          </>
                        )}
                        {rx.clinic && (
                          <>
                            <span>{rx.clinic}</span>
                            <span>·</span>
                          </>
                        )}
                        {rx.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{rx.date}</span>
                          </span>
                        )}
                      </div>

                      {/* Prescribed Medications tags */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {rx.medications.map((med) => (
                          <span
                            key={med.id}
                            className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md"
                          >
                            <Pill className="w-3 h-3 text-emerald-600" />
                            <span className="font-medium">{med.name}</span>
                            {med.dosage && (
                              <span className="text-slate-500 text-[11px]">({med.dosage})</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 group-hover:text-emerald-700 shrink-0 self-end sm:self-center">
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Assistant Quick Access Section */}
          <div className="bg-emerald-50/60 rounded-2xl border border-emerald-100 p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">MediAssist Medical Transcription Assistant</h3>
                <p className="text-xs text-slate-600">Have a question about standard prescription abbreviations or food rules?</p>
              </div>
            </div>

            <form onSubmit={handleQuickSubmit} className="relative">
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Ask about medical abbreviations (e.g. What does 'b.i.d.' or 'p.c.' mean?)..."
                className="w-full pl-4 pr-24 py-3 bg-white rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="font-medium text-slate-500">Common abbreviations:</span>
              <button
                type="button"
                onClick={() => {
                  onAskAi('What does "b.i.d." mean?');
                  onNavigate('voice');
                }}
                className="hover:text-emerald-700 hover:underline cursor-pointer"
              >
                Meaning of "b.i.d."
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  onAskAi('What does "p.c." mean on a prescription?');
                  onNavigate('voice');
                }}
                className="hover:text-emerald-700 hover:underline cursor-pointer"
              >
                Meaning of "p.c."
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  onAskAi('What does "q.d." mean?');
                  onNavigate('voice');
                }}
                className="hover:text-emerald-700 hover:underline cursor-pointer"
              >
                Meaning of "q.d."
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Upcoming Reminders */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900">Today's Reminders</h2>
              </div>
              <button
                onClick={() => onNavigate('reminders')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                View All
              </button>
            </div>

            {reminders.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-slate-500">
                  No medication reminders scheduled yet.
                </p>
                <button
                  onClick={() => onNavigate('scanner')}
                  className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  Scan a prescription to add reminders
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      rem.takenToday
                        ? 'bg-slate-50/70 border-slate-200 opacity-80'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        onClick={() => onToggleReminder(rem.id)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none cursor-pointer"
                        title={rem.takenToday ? 'Mark as pending' : 'Mark as taken'}
                      >
                        {rem.takenToday ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-bold ${
                              rem.takenToday ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {rem.medicineName}
                          </span>
                          <span className="text-xs font-semibold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            {rem.time}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500">
                          <span>{rem.dosage}</span>
                          <span> · </span>
                          <span>{rem.duration}</span>
                        </div>

                        {rem.foodRelation && (
                          <div className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded">
                            {rem.foodRelation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => onNavigate('reminders')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Manage Reminders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Genuine Clinical Safety Notice (No fake claims of drug interaction algorithms) */}
          <div className="bg-slate-100 rounded-2xl border border-slate-200 p-5 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <AlertCircle className="w-4 h-4 text-emerald-600" />
              <span>Patient Safety Notice</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              MediAssist AI is an educational transcription and organizational aid. It does not evaluate clinical pharmacology, make diagnostic decisions, or verify contraindications. Always consult your licensed physician or pharmacist before taking or modifying any medication.
            </p>
            {prescriptions.length > 0 && !isDemoMode && (
              <button
                onClick={onClearData}
                className="mt-2 text-[11px] text-red-600 hover:text-red-800 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Reset my saved prescriptions</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
