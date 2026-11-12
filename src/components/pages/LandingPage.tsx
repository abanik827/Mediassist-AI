import React from 'react';
import { PageView } from '../../types';
import { 
  ShieldCheck, 
  ArrowRight, 
  Scan, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Mic, 
  FileCheck2, 
  Stethoscope, 
  CalendarClock,
  Layers,
  Eye
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageView) => void;
  onToggleDemoMode?: () => void;
  isDemoMode?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigate,
  onToggleDemoMode,
  isDemoMode = false,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and Call-to-Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold tracking-wide border border-emerald-200/60">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Prescription Transcription & Education Aid</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                Understand Your Prescription.{' '}
                <span className="text-emerald-600 block mt-1">Manage Your Medication.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                MediAssist AI transcribes doctor handwriting, translates confusing Latin abbreviations, and helps you organize user-confirmed medication schedules with human verification.
              </p>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('scanner')}
                  className="px-6 py-3.5 text-base font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2.5 group cursor-pointer"
                >
                  <Scan className="w-5 h-5 text-emerald-200" />
                  <span>Upload & Scan Prescription</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-3.5 text-base font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <span>Open Patient Dashboard</span>
                </button>
              </div>

              {/* Key Trust Checkmarks */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 border-t border-slate-200/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verbatim Optical OCR</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Human Verification Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Local Schedule Sync</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Demonstration Card (Explicitly labeled as Synthetic Demonstration) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Dr. R. Vance, MD (Demo Clinic)</div>
                      <div className="text-[11px] text-slate-500">Synthetic Medical Letterhead Illustration</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Synthetic Demo
                  </span>
                </div>

                {/* Simulated Cursive Doctor Handwriting transformation */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium text-slate-700">Doctor's Script Line</span>
                    <span className="font-mono text-[10px] text-emerald-700">Verbatim Extraction</span>
                  </div>
                  <div className="font-serif italic text-slate-700 text-sm tracking-wide bg-amber-50/50 p-2 rounded border border-amber-100 select-none">
                    "Amoxicillin-Clav 875/125mg #14 tab 1 tab b.i.d. p.c. x 7d"
                  </div>
                </div>

                {/* MediAssist AI Decoded Transformation */}
                <div className="mt-4 space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Transcribed Plain-Language Breakdown:
                  </div>

                  <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">Amoxicillin-Clavulanate</span>
                      <span className="text-xs font-bold text-emerald-800 tabular-nums">875 / 125 mg</span>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span><strong>Sig:</strong> Twice daily (every 12 hours)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span><strong>Food rule:</strong> Take directly after breakfast and dinner</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CalendarClock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span><strong>Duration:</strong> Full 7-day course (14 tablets)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2 text-xs text-slate-700">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Human Verification:</strong> Patients must confirm transcribed medicines against paper document before scheduling reminders.</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Ready to scan your own document?
                  </span>
                  <button
                    onClick={() => onNavigate('scanner')}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Upload Prescription</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Pillars Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Platform Capabilities</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Verbatim OCR & Patient-Confirmed Medication Schedules
            </p>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Designed to help patients understand prescriptions, decode Latin medical abbreviations, and organize dose schedules after verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              onClick={() => onNavigate('scanner')}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Scan className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Document OCR Scanner
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transcribes visibly present medication orders from JPG, PNG, and PDF files without guessing missing words.
              </p>
            </div>

            <div 
              onClick={() => onNavigate('agents')}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                5 Specialized Agents
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated pipeline roles for handwriting OCR, strength verification, clarification notices, Latin abbreviations, and schedule organization.
              </p>
            </div>

            <div 
              onClick={() => onNavigate('reminders')}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                User-Verified Reminders
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patient-confirmed reminders stored securely in your browser with full controls to edit, reschedule, or remove anytime.
              </p>
            </div>

            <div 
              onClick={() => onNavigate('voice')}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Voice Abbreviation Q&A
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ask questions by voice or text to clarify what terms like "b.i.d." or "p.c." mean in plain language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Educational Disclaimer Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Clinical Protocol & Safety</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Educational Transcription Aid — Human Verification Mandatory
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                MediAssist AI does not replace your doctor or pharmacist. It transcribes prescription orders verbatim and provides educational translations of Latin shorthand.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">No Hallucinated Names or Medicines</h4>
                    <p className="text-slate-400">If text on a prescription is cut off or illegible, it is marked as unreadable rather than guessed.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">Mandatory Human Check</h4>
                    <p className="text-slate-400">Users must compare each extracted dose and frequency against the original physical paper before scheduling reminders.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-800 rounded-2xl p-6 border border-slate-700 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Ready to Scan Your Prescription?</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload your document to transcribe medication orders and view them in your personal dashboard.
              </p>
              <button
                onClick={() => onNavigate('scanner')}
                className="w-full py-3 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
              >
                Go to Prescription Scanner
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
