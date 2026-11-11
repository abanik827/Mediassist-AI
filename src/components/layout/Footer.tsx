import React from 'react';
import { PageView } from '../../types';
import { ShieldCheck, Lock, HeartPulse, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                MediAssist <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Understand Your Prescription. Manage Your Medication. MediAssist AI translates illegible doctor handwriting and cryptic clinical abbreviations into clear, scheduled, and verified patient instructions.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Client-Side Privacy First</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                <span>Clinical Pharmacopeia Cross-Check</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multi-Agent Verification</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('scanner')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Prescription Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('agents')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  5 Specialized AI Agents
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reminders')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Medication Reminders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('voice')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Voice Health Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Clinical Safety & Privacy */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Safety & Scope</h4>
            <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <li>Synthetically grounded pharmacopeia data.</li>
              <li>Plain-language translation of Latin Rx abbreviations (e.g., b.i.d., q.d., p.c.).</li>
              <li>Food, beverage & drug interaction warnings.</li>
              <li>Never substitutes for an in-person physician consultation.</li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-8 border-t border-slate-800/80 text-xs text-slate-500 leading-relaxed space-y-3">
          <p className="bg-slate-800/60 rounded-xl p-4 border border-slate-800 text-slate-400">
            <strong className="text-slate-200 font-semibold">Important Medical Notice:</strong> MediAssist AI is an educational technology demonstration and medication organization aid. It does not provide medical diagnoses, treatment plans, or emergency services. Always consult your prescribing physician, registered nurse, or licensed pharmacist regarding specific prescription questions, adverse symptoms, or dosage modifications.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
            <p>© {new Date().getFullYear()} MediAssist AI. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="hover:text-slate-300">HIPAA Awareness</span>
              <span>·</span>
              <span className="hover:text-slate-300">Confidentiality Protocol</span>
              <span>·</span>
              <span className="hover:text-slate-300">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
