import React, { useState } from 'react';
import { PageView } from '../../types';
import { 
  FileText, 
  Bot, 
  Bell, 
  Mic, 
  LayoutDashboard, 
  ShieldCheck, 
  Menu, 
  X, 
  Upload
} from 'lucide-react';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  reminderCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, reminderCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNav('landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              aria-label="MediAssist AI Home"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                  MediAssist <span className="text-emerald-600 font-extrabold">AI</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium tracking-normal -mt-1 hidden sm:inline">
                  Clinical Rx Assistant
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNav('dashboard')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                currentPage === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleNav('scanner')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                currentPage === 'scanner'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Scanner</span>
            </button>

            <button
              onClick={() => handleNav('agents')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                currentPage === 'agents'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Agents</span>
            </button>

            <button
              onClick={() => handleNav('reminders')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 relative ${
                currentPage === 'reminders'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Reminders</span>
              {reminderCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 tabular-nums">
                  {reminderCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('voice')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                currentPage === 'voice'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Voice Assistant</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {currentPage === 'landing' ? (
              <button
                onClick={() => handleNav('dashboard')}
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <span>Launch App</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav('scanner')}
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Scan Prescription</span>
                <span className="sm:hidden">Scan Rx</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => handleNav('landing')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'landing' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Home</span>
          </button>
          <button
            onClick={() => handleNav('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'dashboard' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => handleNav('scanner')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'scanner' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Prescription Scanner</span>
          </button>
          <button
            onClick={() => handleNav('agents')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'agents' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bot className="w-4 h-4 text-slate-500" />
            <span>AI Agents</span>
          </button>
          <button
            onClick={() => handleNav('reminders')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'reminders' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-slate-500" />
              <span>Reminders</span>
            </div>
            {reminderCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 tabular-nums">
                {reminderCount} active
              </span>
            )}
          </button>
          <button
            onClick={() => handleNav('voice')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'voice' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Mic className="w-4 h-4 text-slate-500" />
            <span>Voice Assistant</span>
          </button>
        </div>
      )}
    </header>
  );
};
