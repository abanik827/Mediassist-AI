import React, { useState } from 'react';
import { AIAgent } from '../../types';
import { 
  Bot, 
  CheckCircle2, 
  RefreshCw, 
  Play, 
  ShieldCheck, 
  FileSearch, 
  Pill, 
  AlertTriangle, 
  Languages, 
  CalendarClock,
  Sparkles
} from 'lucide-react';

interface AgentsPageProps {
  agents: AIAgent[];
}

export const AgentsPage: React.FC<AgentsPageProps> = ({ agents: initialAgents }) => {
  const [agents, setAgents] = useState<AIAgent[]>(initialAgents);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
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

  const runPipelineSimulation = () => {
    setPipelineRunning(true);
    setActiveStep(1);

    // Step 1
    setAgents((prev) =>
      prev.map((a) => (a.stepNumber === 1 ? { ...a, status: 'Processing' } : { ...a, status: 'Standby' }))
    );

    // Step 2
    setTimeout(() => {
      setActiveStep(2);
      setAgents((prev) =>
        prev.map((a) =>
          a.stepNumber === 1
            ? { ...a, status: 'Active' }
            : a.stepNumber === 2
            ? { ...a, status: 'Processing' }
            : a
        )
      );
    }, 900);

    // Step 3
    setTimeout(() => {
      setActiveStep(3);
      setAgents((prev) =>
        prev.map((a) =>
          a.stepNumber <= 2
            ? { ...a, status: 'Active' }
            : a.stepNumber === 3
            ? { ...a, status: 'Processing' }
            : a
        )
      );
    }, 1800);

    // Step 4
    setTimeout(() => {
      setActiveStep(4);
      setAgents((prev) =>
        prev.map((a) =>
          a.stepNumber <= 3
            ? { ...a, status: 'Active' }
            : a.stepNumber === 4
            ? { ...a, status: 'Processing' }
            : a
        )
      );
    }, 2700);

    // Step 5
    setTimeout(() => {
      setActiveStep(5);
      setAgents((prev) =>
        prev.map((a) =>
          a.stepNumber <= 4
            ? { ...a, status: 'Active' }
            : a.stepNumber === 5
            ? { ...a, status: 'Processing' }
            : a
        )
      );
    }, 3600);

    // Complete
    setTimeout(() => {
      setActiveStep(null);
      setPipelineRunning(false);
      setAgents((prev) => prev.map((a) => ({ ...a, status: 'Ready' })));
    }, 4500);
  };

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Pipeline Simulation Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Multi-Agent Clinical Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Specialized AI Agents
          </h1>
          <p className="text-sm text-slate-500">
            Five synchronized clinical agents verifying handwriting, pharmacopeia formulation, safety, and schedules.
          </p>
        </div>

        {/* Live Pipeline Test Trigger */}
        <button
          onClick={runPipelineSimulation}
          disabled={pipelineRunning}
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
        >
          {pipelineRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Step {activeStep}/5 in Progress...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Run Pipeline Simulation</span>
            </>
          )}
        </button>
      </div>

      {/* Agents Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {agents.map((agent) => {
          const isSelected = agent.id === selectedAgentId;
          const isProcessing = agent.status === 'Processing';
          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-emerald-50/70 border-emerald-500 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                  {getAgentIcon(agent.id)}
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    isProcessing
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : agent.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
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

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Pharmacopeia Confidence</span>
              <span className="text-lg font-bold font-mono text-emerald-700 tabular-nums">
                {selectedAgent.confidenceScore}%
              </span>
            </div>
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Execution Status</span>
              <span className="text-sm font-semibold text-slate-800">{selectedAgent.status}</span>
            </div>
          </div>
        </div>

        {/* Agent Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clinical Mandate</h3>
          <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
            {selectedAgent.description}
          </p>
        </div>

        {/* Responsibilities list */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Responsibilities</h3>
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
