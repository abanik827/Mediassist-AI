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
  Layers
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageView) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
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
                <span>Next-Gen Healthcare Prescription Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                Understand Your Prescription.{' '}
                <span className="text-emerald-600 block mt-1">Manage Your Medication.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                MediAssist AI decodes doctor handwriting, translates confusing Latin abbreviations, cross-checks drug interactions, and automatically organizes reminders so you never miss a dose.
              </p>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-3.5 text-base font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2.5 group cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('scanner')}
                  className="px-6 py-3.5 text-base font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <Scan className="w-4 h-4 text-emerald-600" />
                  <span>Scan a Prescription</span>
                </button>
              </div>

              {/* Key Trust Checkmarks */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 border-t border-slate-200/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Handwriting OCR Decoded</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>5-Agent Clinical Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1-Click Reminder Sync</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Prescription Card Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Dr. Robert Vance, MD</div>
                      <div className="text-[11px] text-slate-500">Metropolitan Heart & Vascular Institute</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified Rx
                  </span>
                </div>

                {/* Simulated Cursive Doctor Handwriting transformation */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium text-slate-700">Doctor's Script Line</span>
                    <span className="font-mono text-[10px] text-emerald-600">OCR Confirmed 99.4%</span>
                  </div>
                  <div className="font-serif italic text-slate-700 text-sm tracking-wide bg-amber-50/50 p-2 rounded border border-amber-100 select-none">
                    "Amoxicillin-Clav 875/125mg #14 tab 1 tab b.i.d. p.c. x 7d"
                  </div>
                </div>

                {/* MediAssist AI Decoded Transformation */}
                <div className="mt-4 space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    MediAssist AI Decoded Guidance:
                  </div>

                  <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">Amoxicillin-Clavulanate</span>
                      <span className="text-xs font-bold text-emerald-800 tabular-nums">875 / 125 mg</span>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span><strong>Schedule:</strong> Take 1 tablet twice daily (every 12 hours)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span><strong>Food rule:</strong> Take directly after breakfast and dinner</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CalendarClock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span><strong>Duration:</strong> Full 7-day course (14 tablets total)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 flex items-start gap-2 text-xs text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Safety Precaution:</strong> Finish all doses as prescribed even if early symptoms resolve to prevent recurrence.</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Status: <strong className="text-slate-800">2 Daily Reminders Ready</strong>
                  </div>
                  <button
                    onClick={() => onNavigate('reminders')}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>View Reminders</span>
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
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Core Capabilities</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              From Confusing Handwriting to Coordinated Patient Care
            </p>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Every prescription undergoes a standardized five-agent clinical intelligence pipeline to ensure patient safety, comprehension, and medication adherence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div 
              onClick={() => onNavigate('scanner')}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Scan className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Doctor Handwriting OCR
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Optical character models trained specifically on clinical calligraphy, shorthand Rx symbols, and pharmacy stamps.
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              onClick={() => onNavigate('agents')}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                5 Specialized AI Agents
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Collaborative verification from OCR extraction to clinical formulation, drug interactions, plain translation, and chronotherapy.
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              onClick={() => onNavigate('reminders')}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Automated Reminders
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                One-click conversion of scanned instructions into customizable daily dose alerts with duration tracking and meal guidance.
              </p>
            </div>

            {/* Feature 4 */}
            <div 
              onClick={() => onNavigate('voice')}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Voice Health Assistant
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ask questions by voice or text. Get clear, plain-language answers about how, when, and with what food to take your medicines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prescription Safety Proof Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Medical Accuracy & Rigor</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Eliminating Medication Errors Caused by Unclear Instructions
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Over 30% of medication non-adherence and dosing errors stem from misread handwriting or unclear Latin directions. MediAssist AI translates cryptic scripts into clear, verifiable patient roadmaps.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">Latin Prescription Decoder</h4>
                    <p className="text-xs text-slate-400">Instantly decodes terms like b.i.d., t.i.d., p.o., and p.c. into exact hours and food instructions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">Food & Drug Interaction Verification</h4>
                    <p className="text-xs text-slate-400">Identifies contraindications like grapefruit with statins or calcium interactions with antibiotics.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">Complete Adherence Tracking</h4>
                    <p className="text-xs text-slate-400">Interactive check-offs, duration counters, and customizable reminders keep regimens on track.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Demo CTA Card */}
            <div className="lg:col-span-6 bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <FileCheck2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Experience MediAssist AI Today</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Try our interactive scanner with pre-configured synthetic sample prescriptions or upload your own prescription document.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => onNavigate('scanner')}
                    className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    Open Prescription Scanner
                  </button>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-300 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                  >
                    Go to Patient Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
