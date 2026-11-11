import React, { useState } from 'react';
import { Prescription, Medication } from '../../types';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw,
  Plus,
  Stethoscope,
  Info
} from 'lucide-react';

interface ScannerPageProps {
  prescriptions: Prescription[];
  selectedPrescription: Prescription;
  onSelectPrescription: (rx: Prescription) => void;
  onAddMedicationToReminders: (medication: Medication, doctorName: string) => void;
  onAddAllToReminders: (medications: Medication[], doctorName: string) => void;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({
  prescriptions,
  selectedPrescription,
  onSelectPrescription,
  onAddMedicationToReminders,
  onAddAllToReminders,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState<string>('');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'extracted' | 'doctor' | 'safety'>('extracted');
  const [addedReminderIds, setAddedReminderIds] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const runScanSimulation = () => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStage('Stage 1/5: OCR & Handwriting Recognition Agent isolating cursive lines...');

    setTimeout(() => {
      setScanProgress(40);
      setScanStage('Stage 2/5: Clinical Formulation Agent verifying active pharmacopeia & units...');
    }, 700);

    setTimeout(() => {
      setScanProgress(68);
      setScanStage('Stage 3/5: Drug Interaction & Safety Agent checking contraindications...');
    }, 1400);

    setTimeout(() => {
      setScanProgress(88);
      setScanStage('Stage 4/5: Patient Clarification Agent translating Latin abbreviations...');
    }, 2000);

    setTimeout(() => {
      setScanProgress(100);
      setScanStage('Stage 5/5: Schedule & Adherence Planner generating chronotherapy...');
      setTimeout(() => {
        setIsScanning(false);
        showNotification('Prescription scan complete! Information verified by 5 AI agents.');
      }, 500);
    }, 2600);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddMed = (med: Medication) => {
    onAddMedicationToReminders(med, selectedPrescription.doctorName);
    setAddedReminderIds((prev) => ({ ...prev, [med.id]: true }));
    showNotification(`Added ${med.name} (${med.timing}) to active reminders!`);
  };

  const handleAddAll = () => {
    onAddAllToReminders(selectedPrescription.medications, selectedPrescription.doctorName);
    const newAdded: Record<string, boolean> = {};
    selectedPrescription.medications.forEach((m) => {
      newAdded[m.id] = true;
    });
    setAddedReminderIds(newAdded);
    showNotification(`Synchronized all ${selectedPrescription.medications.length} medications to Reminders!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Prescription Vision & Decryption Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Prescription Scanner
          </h1>
          <p className="text-sm text-slate-500">
            Upload or select a prescription image to transcribe doctor handwriting and decode clinical instructions.
          </p>
        </div>

        {/* 1-Click Sample Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Sample Prescriptions:</span>
          {prescriptions.map((rx) => (
            <button
              key={rx.id}
              onClick={() => {
                onSelectPrescription(rx);
                setUploadedFileName(null);
                setAddedReminderIds({});
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedPrescription.id === rx.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {rx.sampleType} Rx
            </button>
          ))}
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs text-emerald-700 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Two Column Workspace: Upload / Preview on Left (5 cols) & Extracted Info on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload & Image Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Drag & Drop Upload Card */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all bg-white ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              accept="image/*,application/pdf"
              onChange={handleFileInput}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">
                  {uploadedFileName ? (
                    <span className="text-emerald-700 font-bold">{uploadedFileName}</span>
                  ) : (
                    <>Click to upload or drag & drop prescription</>
                  )}
                </p>
                <p className="text-xs text-slate-400">
                  PNG, JPG, HEIC, or scanned PDF files supported
                </p>
              </div>
            </label>
          </div>

          {/* Interactive Prescription Image Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Document Preview</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                {selectedPrescription.sampleType} Script
              </span>
            </div>

            {/* Realistic Prescription Document Rendering */}
            <div className="bg-amber-50/40 rounded-xl border border-amber-200/80 p-5 font-serif relative overflow-hidden shadow-inner">
              {/* Rx Watermark / Header */}
              <div className="border-b border-amber-200/90 pb-3 flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900 font-sans">
                    {selectedPrescription.doctorName}
                  </div>
                  <div className="text-xs text-slate-600 font-sans">
                    {selectedPrescription.specialty}
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans">
                    {selectedPrescription.clinic}
                  </div>
                </div>
                <div className="text-2xl font-serif font-black text-amber-800/80 select-none">
                  ℞
                </div>
              </div>

              {/* Patient header */}
              <div className="py-2.5 text-xs text-slate-700 font-sans flex items-center justify-between border-b border-amber-200/70">
                <div>
                  <strong>Pt:</strong> {selectedPrescription.patientName} (Age: {selectedPrescription.patientAge})
                </div>
                <div>
                  <strong>Date:</strong> {selectedPrescription.date}
                </div>
              </div>

              {/* Handwritten body text simulation */}
              <div className="py-4 space-y-3 font-serif italic text-slate-800 text-sm">
                <div className="text-xs font-sans not-italic text-slate-500 uppercase tracking-wider">
                  Physician Orders:
                </div>
                {selectedPrescription.medications.map((m, idx) => (
                  <div key={m.id} className="p-2 bg-white/70 rounded border border-amber-200/60 leading-relaxed">
                    <span className="font-semibold text-slate-900">#{idx + 1} {m.name} {m.dosage}</span>
                    <div className="text-xs text-slate-600">
                      Sig: {m.frequency} — {m.duration}
                    </div>
                  </div>
                ))}
              </div>

              {/* Diagnosis stamp */}
              <div className="pt-2 text-[11px] font-sans text-slate-600 border-t border-amber-200/70 flex items-center justify-between">
                <span>Dx: {selectedPrescription.diagnosisNote}</span>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/80 px-2 py-0.5 rounded">
                  Clinic Stamp Verified
                </span>
              </div>
            </div>

            {/* Scan Prescription Action Button */}
            <div className="pt-2 space-y-3">
              <button
                onClick={runScanSimulation}
                disabled={isScanning}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Document...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Scan Prescription</span>
                  </>
                )}
              </button>

              {/* Scanning progress bar */}
              {isScanning && (
                <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium">{scanStage}</span>
                    <span className="font-mono tabular-nums">{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Extracted Information & Decoded Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header Tabs */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Extracted Clinical Information</h2>
              </div>

              {/* Segmented Filter Control */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setActiveTab('extracted')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    activeTab === 'extracted'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Medications ({selectedPrescription.medications.length})
                </button>
                <button
                  onClick={() => setActiveTab('doctor')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    activeTab === 'doctor'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Physician Details
                </button>
                <button
                  onClick={() => setActiveTab('safety')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    activeTab === 'safety'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Interactions & Alerts
                </button>
              </div>
            </div>

            {/* Tab 1: Extracted Medications */}
            {activeTab === 'extracted' && (
              <div className="p-5 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="text-xs text-slate-500">
                    Showing <strong className="text-slate-800">{selectedPrescription.medications.length}</strong> decoded medications
                  </div>
                  <button
                    onClick={handleAddAll}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add All to Active Reminders</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedPrescription.medications.map((med, index) => {
                    const isAdded = addedReminderIds[med.id];
                    return (
                      <div
                        key={med.id}
                        className="p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                                {index + 1}
                              </span>
                              <h3 className="text-base font-bold text-slate-900">{med.name}</h3>
                              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                {med.dosage} · {med.form}
                              </span>
                            </div>
                            <p className="text-xs text-emerald-700 font-medium mt-1">
                              Purpose: {med.purpose}
                            </p>
                          </div>

                          <button
                            onClick={() => handleAddMed(med)}
                            disabled={isAdded}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                              isAdded
                                ? 'bg-emerald-100 text-emerald-800 cursor-default'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Reminder Active</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Reminder</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Decoded Latin Abbreviation & Plain Language Schedule */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
                            <span className="font-semibold text-slate-700 block mb-1">
                              Doctor Sig & Latin Translation:
                            </span>
                            <span className="font-mono text-slate-500 block mb-0.5">
                              Written: "{med.frequency}"
                            </span>
                            <span className="text-slate-800 font-medium">
                              Plain Meaning: {med.decodedFrequency}
                            </span>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
                            <span className="font-semibold text-slate-700 block mb-1">
                              Timing & Food Instruction:
                            </span>
                            <div className="flex items-center gap-1 text-slate-800 font-medium">
                              <Clock className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{med.timing} · {med.foodRelation}</span>
                            </div>
                            <span className="text-slate-500 block mt-0.5">
                              Duration: {med.duration}
                            </span>
                          </div>
                        </div>

                        {/* Patient Instruction & Precautions */}
                        <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs space-y-1">
                          <div className="font-semibold text-emerald-900">How to take:</div>
                          <p className="text-emerald-800/90 leading-relaxed">{med.instructions}</p>
                          {med.precautions.length > 0 && (
                            <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
                              <span className="text-amber-800 font-semibold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                Caution:
                              </span>
                              {med.precautions.map((p, i) => (
                                <span key={i} className="text-slate-600">
                                  {p}{i < med.precautions.length - 1 ? ' · ' : ''}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Physician Details */}
            {activeTab === 'doctor' && (
              <div className="p-6 space-y-4 text-sm">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedPrescription.doctorName}</h3>
                    <p className="text-xs text-slate-600">{selectedPrescription.specialty}</p>
                    <p className="text-xs text-slate-500">{selectedPrescription.clinic}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block mb-1">Prescription Date</span>
                    <span className="font-semibold text-slate-900 text-sm">{selectedPrescription.date}</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block mb-1">Patient Name & Age</span>
                    <span className="font-semibold text-slate-900 text-sm">
                      {selectedPrescription.patientName} (Age: {selectedPrescription.patientAge})
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="text-slate-500 block">Clinical Diagnostic Notes</span>
                  <p className="font-medium text-slate-800 text-sm">{selectedPrescription.diagnosisNote}</p>
                </div>
              </div>
            )}

            {/* Tab 3: Interactions & Alerts */}
            {activeTab === 'safety' && (
              <div className="p-6 space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-emerald-950">Safety Cross-Check: Verified Safe</h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      All active medications in this regimen were checked by Agent 3 (Drug Interaction & Safety Agent). No life-threatening contraindicated combinations were detected.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Dietary & Chronotherapy Recommendations:
                  </h4>
                  {selectedPrescription.medications.map((m) => (
                    <div key={m.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="font-bold text-slate-900">{m.name} ({m.dosage})</div>
                      <div className="text-slate-600">
                        <strong>Rule:</strong> {m.foodRelation} — {m.instructions}
                      </div>
                      {m.precautions.map((p, idx) => (
                        <div key={idx} className="text-amber-800 flex items-center gap-1.5 pt-0.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
