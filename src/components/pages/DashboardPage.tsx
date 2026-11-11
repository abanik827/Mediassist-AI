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
  AlertCircle
} from 'lucide-react';

interface DashboardPageProps {
  prescriptions: Prescription[];
  reminders: Reminder[];
  onNavigate: (page: PageView) => void;
  onSelectPrescription: (prescription: Prescription) => void;
  onToggleReminder: (reminderId: string) => void;
  onAskAi: (question: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  prescriptions,
  reminders,
  onNavigate,
  onSelectPrescription,
  onToggleReminder,
  onAskAi,
}) => {
  const [quickQuery, setQuickQuery] = useState('');

  const completedCount = reminders.filter((r) => r.takenToday).length;
  const totalReminders = reminders.length;
  const adherenceRate = totalReminders > 0 ? Math.round((completedCount / totalReminders) * 100) : 0;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    onAskAi(quickQuery);
    onNavigate('voice');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Welcome Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>MediAssist Clinical Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, Sarah
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Your prescriptions are organized, verified, and cross-referenced with your active daily medication schedule.
          </p>
        </div>

        {/* Quick Prescription Upload Action Card */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('scanner')}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-emerald-200" />
            <span>Upload & Scan Prescription</span>
          </button>
          <button
            onClick={() => onNavigate('reminders')}
            className="px-5 py-3 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-600"
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Manage Schedule</span>
          </button>
        </div>
      </div>

      {/* Metric Counters (Clean unboxed tabular presentation) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Active Prescriptions</div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {prescriptions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-700 font-medium">100% Verified</span>
            <span>·</span>
            <span>3 Clinics</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Daily Reminders</div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {totalReminders}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-slate-700 font-medium">{completedCount} Completed</span>
            <span>·</span>
            <span>{totalReminders - completedCount} Remaining</span>
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
          <div className="text-xs font-medium text-slate-500 mb-1">Active AI Agents</div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            5 / 5
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-700 font-medium">0 Drug Conflicts</span>
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
                <h2 className="text-base font-bold text-slate-900">Recent Doctor Prescriptions</h2>
                <p className="text-xs text-slate-500">Scanned and verified through MediAssist AI OCR & Clinical agents</p>
              </div>
              <button
                onClick={() => onNavigate('scanner')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Upload New</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

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
                        {rx.title}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {rx.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{rx.doctorName}</span>
                      <span>·</span>
                      <span>{rx.clinic}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{rx.date}</span>
                      </span>
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
                          <span className="text-slate-500 text-[11px]">({med.dosage})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 group-hover:text-emerald-700 shrink-0 self-end sm:self-center">
                    <span>View Analysis</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant Quick Access Section */}
          <div className="bg-emerald-50/60 rounded-2xl border border-emerald-100 p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">MediAssist AI Prescription Assistant</h3>
                <p className="text-xs text-slate-600">Have a question about dosage, food instructions, or abbreviations?</p>
              </div>
            </div>

            <form onSubmit={handleQuickSubmit} className="relative">
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Ask about your medications (e.g. What does 'b.i.d.' mean? Can I take Amoxicillin with meals?)"
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

            {/* Quick suggested chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="font-medium text-slate-500">Popular:</span>
              <button
                type="button"
                onClick={() => {
                  onAskAi('What does "b.i.d." written on my Amoxicillin prescription mean?');
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
                  onAskAi('Should I take Lisinopril with food?');
                  onNavigate('voice');
                }}
                className="hover:text-emerald-700 hover:underline cursor-pointer"
              >
                Lisinopril with food
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  onAskAi('Why should I avoid grapefruit with Atorvastatin?');
                  onNavigate('voice');
                }}
                className="hover:text-emerald-700 hover:underline cursor-pointer"
              >
                Grapefruit interaction
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
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                View All
              </button>
            </div>

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

                      <div className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded">
                        {rem.foodRelation}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('reminders')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Edit Reminders & Add Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Clinical Safety Tip */}
          <div className="bg-amber-50/80 rounded-2xl border border-amber-200/70 p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Important Medication Tip</span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Always complete full antibiotic cycles (like your current Amoxicillin prescription) even after feeling healthy to prevent bacterial relapse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
