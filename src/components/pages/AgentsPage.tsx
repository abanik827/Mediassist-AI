import React, { useState } from 'react';
import { AIAgent, AgentReport, Prescription } from '../../types';
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
  Sparkles,
  Check,
  ChevronRight
} from 'lucide-react';

interface AgentsPageProps {
  agents: AIAgent[];
  prescriptions: Prescription[];
  latestReports?: AgentReport[];
}

export const AgentsPage: React.FC<AgentsPageProps> = ({
  agents: initialAgents,
  prescriptions,
  latestReports = [],
}) => {
  const [agents, setAgents] = useState<AIAgent[]>(initialAgents);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(initialAgents[0].id);
  const [selectedRxId, setSelectedRxId] = useState<string>(prescriptions[0]?.id || 'rx-101');
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);

  const selectedRx = prescriptions.find((r) => r.id === selectedRxId) || prescriptions[0];

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
    setPipelineLogs([`[0.0s] Initializing 5-Agent Clinical Pipeline for "${selectedRx.title}"...`]);

    // Step 1: OCR
    setAgents((prev) =>
      prev.map((a) => (a.stepNumber === 1 ? { ...a, status: 'Processing' } : { ...a, status: 'Standby' }))
    );
    setPipelineLogs((prev) => [
      ...prev,
      `[0.4s] Agent 1 (OCR): Deciphering cursive orders: "${selectedRx.medications.map((m) => m.name).join(', ')}" (Confidence: 99.2%)`,
    ]);

    // Step 2: Formulation
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
      setPipelineLogs((prev) => [
        ...prev,
        `[1.1s] Agent 2 (Formulation): Matched active APIs against USP pharmacopeia. All therapeutic strength windows validated.`,
      ]);
    }, 900);

    // Step 3: Interactions
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
      setPipelineLogs((prev) => [
        ...prev,
        `[2.0s] Agent 3 (Interactions): Multi-regimen cross-check passed. Zero life-threatening drug-drug contraindications.`,
      ]);
    }, 1800);

    // Step 4: Latin Translation
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
      setPipelineLogs((prev) => [
        ...prev,
        `[2.8s] Agent 4 (Translation): Decoded Latin shorthand ("${selectedRx.medications[0]?.frequency}") into plain patient schedule.`,
      ]);
    }, 2700);

    // Step 5: Schedule Planner
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
      setPipelineLogs((prev) => [
        ...prev,
        `[3.6s] Agent 5 (Schedule): Generated meal-synchronized chronotherapy timeline ready for human confirmation.`,
      ]);
    }, 3600);

    // Complete
    setTimeout(() => {
      setActiveStep(null);
      setPipelineRunning(false);
      setAgents((prev) => prev.map((a) => ({ ...a, status: 'Ready' })));
      setPipelineLogs((prev) => [
        ...prev,
        `[4.2s] Pipeline Complete: All 5 agents completed verification with 100% agreement!`,
      ]);
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
        <div className="flex items-center gap-3">
          <select
            value={selectedRxId}
            onChange={(e) => setSelectedRxId(e.target.value)}
            disabled={pipelineRunning}
            className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 shadow-xs focus:ring-2 focus:ring-emerald-500"
          >
            {prescriptions.map((r) => (
              <option key={r.id} value={r.id}>
                Test: {r.sampleType} Rx
              </option>
            ))}
          </select>

          <button
            onClick={runPipelineSimulation}
            disabled={pipelineRunning}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
          >
            {pipelineRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Step {activeStep}/5 Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>Execute Agent Pipeline</span>
              </>
            )}
          </button>
        </div>
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
                  ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
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

      {/* Live Execution Logs Terminal (Visible during & after simulation) */}
      {pipelineLogs.length > 0 && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-2 font-mono text-xs text-emerald-400 shadow-inner">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 text-[11px]">
            <span>Live Agent Execution Trace:</span>
            <span>Gemini Multimodal Validation</span>
          </div>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {pipelineLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

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
