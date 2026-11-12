import React, { useState } from 'react';
import { AIAgent, AgentReport, Prescription } from '../../types';
import { 
  Bot, 
  CheckCircle2, 
  ShieldCheck, 
  FileSearch, 
  Pill, 
  AlertTriangle, 
  Languages, 
  CalendarClock,
  Sparkles,
  Info,
  Clock
} from 'lucide-react';

interface AgentsPageProps {
  agents: AIAgent[];
  prescriptions: Prescription[];
  latestReports?: AgentReport[];
  isDemoMode?: boolean;
}

export const AgentsPage: React.FC<AgentsPageProps> = ({
  agents: initialAgents,
  prescriptions,
  latestReports = [],
  isDemoMode = false,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(initialAgents[0].id);

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'agent-1':
        return <FileSearch className="w-5 h-5 text-emerald-600" />;
      case 'agent-2':
        return <Pill className="w-5 h-5 text-emerald-600" />;
      case 'agent-3':
        return <AlertTriangle className="w-5 h-5 text-emerald-600" />;
      case 'agent-4':
        return <Languages className="w-5 h-5 text-emerald-600" />;
      case 'agent-5':
        return <CalendarClock className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bot className="w-5 h-5 text-emerald-600" />;
    }
  };

  const selectedAgent = initialAgents.find((a) => a.id === selectedAgentId) || initialAgents[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Prescription Transcription Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Specialized AI Agents
          </h1>
          <p className="text-sm text-slate-500">
            Dedicated pipeline components responsible for optical character recognition, dosage parsing, abbreviation translation, and reminder planning.
          </p>
        </div>
      </div>

      {/* Agents Overview Strip (No fabricated 99.8% metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {initialAgents.map((agent) => {
          const isSelected = agent.id === selectedAgentId;
          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                  {getAgentIcon(agent.id)}
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {agent.status}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-400 mb-0.5">
                Agent 0{agent.stepNumber}
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                {agent.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {agent.shortRole}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Prescription Extraction Trace (Real findings from scan, or standby message) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Pipeline Verification Status for Scanned Documents
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {latestReports.length > 0 ? `${latestReports.length} agent reports recorded` : 'Standby'}
          </span>
        </div>

        {latestReports.length === 0 ? (
          <div className="py-6 text-center space-y-2 text-slate-500 text-xs">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">Awaiting Prescription Scan</p>
            <p className="text-slate-400 max-w-md mx-auto">
              When you upload and scan a real prescription document, each agent's genuine transcription and validation findings will be displayed here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {latestReports.map((report) => (
              <div key={report.agentNumber} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    Agent 0{report.agentNumber}: {report.agentName}
                  </span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {report.status}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {report.finding}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deep Dive Agent Details & Responsibilities */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              {getAgentIcon(selectedAgent.id)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700">Agent 0{selectedAgent.stepNumber}</span>
                <span>·</span>
                <span className="text-xs font-semibold text-slate-500">{selectedAgent.shortRole}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{selectedAgent.name}</h2>
            </div>
          </div>
        </div>

        {/* Agent Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Functional Role</h3>
          <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
            {selectedAgent.description}
          </p>
        </div>

        {/* Responsibilities list */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operational Responsibilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedAgent.responsibilities.map((resp, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{resp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Contracts: Input & Output Artifacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Input Ingested
            </span>
            <p className="text-xs text-slate-800 font-mono">
              {selectedAgent.inputData}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Output Artifact
            </span>
            <p className="text-xs text-emerald-950 font-mono">
              {selectedAgent.outputArtifact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
