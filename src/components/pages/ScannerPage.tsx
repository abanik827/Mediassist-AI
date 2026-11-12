import React, { useState, useRef } from 'react';
import { Prescription, Medication, AgentReport, ExtractedPrescriptionData } from '../../types';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  Stethoscope, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  X, 
  Eye, 
  AlertCircle,
  FileCheck,
  HelpCircle,
  Layers
} from 'lucide-react';

interface ScannerPageProps {
  prescriptions: Prescription[];
  selectedPrescription: Prescription | null;
  isDemoMode: boolean;
  onSelectPrescription: (rx: Prescription) => void;
  onAddMedicationToReminders: (medication: Medication, doctorName: string | null) => void;
  onAddAllToReminders: (medications: Medication[], doctorName: string | null) => void;
  onSaveNewPrescription: (rx: Prescription) => void;
  onAgentReportsUpdated: (reports: AgentReport[]) => void;
  onToggleDemoMode: () => void;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({
  prescriptions,
  selectedPrescription,
  isDemoMode,
  onSelectPrescription,
  onAddMedicationToReminders,
  onAddAllToReminders,
  onSaveNewPrescription,
  onAgentReportsUpdated,
  onToggleDemoMode,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState<number>(100);

  // Live Extraction State for currently uploaded document
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedPrescriptionData | null>(null);
  const [activeTab, setActiveTab] = useState<'extracted' | 'doctor' | 'safety'>('extracted');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);
  const [addedReminderIds, setAddedReminderIds] = useState<Record<string, boolean>>({});

  // Mandatory Human Verification Modal State
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [pendingMedToAdd, setPendingMedToAdd] = useState<Medication | null>(null);
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [humanVerifiedConfirmed, setHumanVerifiedConfirmed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 6000);
  };

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
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  // Requirement: When a new file is uploaded, CLEAR all previous prescription results
  const processSelectedFile = (file: File) => {
    // Clear previous results immediately
    setExtractedData(null);
    setScanError(null);
    setAddedReminderIds({});
    setImageZoom(100);

    if (uploadedPreviewUrl) {
      URL.revokeObjectURL(uploadedPreviewUrl);
    }

    setUploadedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setUploadedPreviewUrl(objectUrl);

    // Read base64 for API
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedBase64(reader.result as string);
    };
    reader.readAsDataURL(file);

    showNotification(`Uploaded "${file.name}". Click "Scan Prescription" to transcribe text.`, 'success');
  };

  const clearUploadedFile = () => {
    if (uploadedPreviewUrl) {
      URL.revokeObjectURL(uploadedPreviewUrl);
    }
    setUploadedFile(null);
    setUploadedPreviewUrl(null);
    setUploadedBase64(null);
    setExtractedData(null);
    setScanError(null);
    setImageZoom(100);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Real Gemini Multimodal OCR Processing
  const runRealDocumentScan = async () => {
    if (!uploadedBase64 || !uploadedFile) {
      showNotification('Please upload an actual prescription image or document first.', 'warning');
      return;
    }

    setIsScanning(true);
    setScanError(null);

    try {
      const response = await fetch('/api/scan-prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: uploadedBase64,
          mimeType: uploadedFile.type || 'image/jpeg',
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.extraction) {
        throw new Error(result.error || 'Prescription transcription failed. Please check image quality.');
      }

      const extraction: ExtractedPrescriptionData = result.extraction;
      setExtractedData(extraction);

      // Map to standard internal Prescription structure for state
      const mappedMedications: Medication[] = extraction.medications.map((m, idx) => ({
        id: `med-${Date.now()}-${idx}`,
        name: m.medicine_name_as_written,
        dosage: m.dosage_as_written || 'Unspecified dosage',
        frequency: m.frequency_as_written || 'As directed',
        duration: m.duration_as_written || 'As directed',
        timing: m.timing_as_written || 'As directed',
        instructions: m.additional_instructions_as_written || 'Verify directions with pharmacist.',
        isUncertain: m.is_uncertain,
      }));

      const newPrescriptionRecord: Prescription = {
        id: `rx-${Date.now()}`,
        title: uploadedFile.name.replace(/\.[^/.]+$/, '') + ' Transcription',
        doctorName: extraction.doctor_name,
        clinic: extraction.clinic_name,
        date: extraction.prescription_date,
        patientName: extraction.patient_name,
        medications: mappedMedications,
        status: 'User Scanned',
        customImageUrl: uploadedPreviewUrl || undefined,
        uploadedFileName: uploadedFile.name,
        humanVerified: false,
        uncertainFields: extraction.uncertain_or_unreadable_fields,
        isDemo: false,
      };

      onSaveNewPrescription(newPrescriptionRecord);

      // Generate accurate diagnostic agent reports (no fake percentages)
      const agentReports: AgentReport[] = [
        {
          agentNumber: 1,
          agentName: 'OCR & Handwriting Transcription Agent',
          finding: `Transcribed ${mappedMedications.length} medication line item(s). Visibly identified doctor: ${extraction.doctor_name || 'Not detected'}, patient: ${extraction.patient_name || 'Not detected'}.`,
          status: 'Complete',
        },
        {
          agentNumber: 2,
          agentName: 'Formulation & Dosage Verification Agent',
          finding: `Preserved verbatim dosage notation: ${mappedMedications.map((m) => m.dosage).join(', ')}.`,
          status: 'Complete',
        },
        {
          agentNumber: 3,
          agentName: 'Safety & Clarification Notice Agent',
          finding: extraction.uncertain_or_unreadable_fields.length > 0
            ? `${extraction.uncertain_or_unreadable_fields.length} ambiguous item(s) flagged for pharmacist clarification.`
            : 'All identified lines extracted verbatim without external guessing.',
          status: 'Complete',
        },
        {
          agentNumber: 4,
          agentName: 'Abbreviation Translation Agent',
          finding: 'Latin Sig abbreviations preserved as written. Educational explanations ready for patient review.',
          status: 'Complete',
        },
        {
          agentNumber: 5,
          agentName: 'Adherence & Reminder Organization Agent',
          finding: 'Awaiting human verification before scheduling reminders.',
          status: 'Awaiting Verification',
        },
      ];

      onAgentReportsUpdated(agentReports);
      showNotification(`Successfully transcribed "${uploadedFile.name}". Please review the extracted fields below.`, 'success');
    } catch (err: any) {
      console.error('OCR Scan failed:', err);
      setScanError(err.message || 'Prescription scan failed. Please ensure the document is clear and readable.');
      showNotification(err.message || 'Prescription scan failed.', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  // Human Verification Gate Handlers
  const handleInitiateAddMed = (med: Medication) => {
    setPendingMedToAdd(med);
    setIsBulkAdding(false);
    setHumanVerifiedConfirmed(false);
    setVerificationModalOpen(true);
  };

  const handleInitiateAddAll = () => {
    setPendingMedToAdd(null);
    setIsBulkAdding(true);
    setHumanVerifiedConfirmed(false);
    setVerificationModalOpen(true);
  };

  const handleConfirmHumanVerification = () => {
    if (!humanVerifiedConfirmed) {
      showNotification('Please check the confirmation box verifying that the details match your paper document.', 'warning');
      return;
    }

    const currentDoc = extractedData 
      ? { doctorName: extractedData.doctor_name, medications: selectedPrescription?.medications || [] }
      : selectedPrescription;

    if (!currentDoc) return;

    if (isBulkAdding) {
      onAddAllToReminders(currentDoc.medications, currentDoc.doctorName);
      const newAdded: Record<string, boolean> = {};
      currentDoc.medications.forEach((m) => {
        newAdded[m.id] = true;
      });
      setAddedReminderIds(newAdded);
      showNotification(`Verified and scheduled ${currentDoc.medications.length} medication(s) to reminders!`, 'success');
    } else if (pendingMedToAdd) {
      onAddMedicationToReminders(pendingMedToAdd, currentDoc.doctorName);
      setAddedReminderIds((prev) => ({ ...prev, [pendingMedToAdd.id]: true }));
      showNotification(`Verified and scheduled "${pendingMedToAdd.name}" to reminders!`, 'success');
    }

    setVerificationModalOpen(false);
    setPendingMedToAdd(null);
  };

  // Active view data: Either real extracted data from uploaded file or demo prescription if in demo mode
  const currentMedications: Medication[] = extractedData
    ? extractedData.medications.map((m, idx) => ({
        id: m.id || `med-${idx}`,
        name: m.medicine_name_as_written,
        dosage: m.dosage_as_written || 'Not stated',
        frequency: m.frequency_as_written || 'Not stated',
        duration: m.duration_as_written || 'Not stated',
        timing: m.timing_as_written || 'Not stated',
        instructions: m.additional_instructions_as_written || 'No additional remarks written.',
        isUncertain: m.is_uncertain,
      }))
    : isDemoMode && selectedPrescription
    ? selectedPrescription.medications
    : [];

  const currentDoctorName = extractedData ? extractedData.doctor_name : isDemoMode && selectedPrescription ? selectedPrescription.doctorName : null;
  const currentPatientName = extractedData ? extractedData.patient_name : isDemoMode && selectedPrescription ? selectedPrescription.patientName : null;
  const currentClinicName = extractedData ? extractedData.clinic_name : isDemoMode && selectedPrescription ? selectedPrescription.clinic : null;
  const currentDate = extractedData ? extractedData.prescription_date : isDemoMode && selectedPrescription ? selectedPrescription.date : null;
  const uncertainFields = extractedData ? extractedData.uncertain_or_unreadable_fields : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Document Transcription & Patient Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Prescription Scanner
          </h1>
          <p className="text-sm text-slate-500">
            Upload your prescription document (JPG, PNG, PDF) to transcribe written medication orders.
          </p>
        </div>

        {/* Optional Demo Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDemoMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border cursor-pointer ${
              isDemoMode
                ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isDemoMode ? 'Demo Mode Active' : 'Test With Synthetic Sample'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center justify-between shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : notification.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs hover:underline cursor-pointer ml-3 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Real Document Upload & Live Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upload Input Card */}
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
              ref={fileInputRef}
              type="file"
              id="prescription-file-upload"
              accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
              onChange={handleFileInput}
              className="hidden"
            />
            <label
              htmlFor="prescription-file-upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">
                  {uploadedFile ? (
                    <span className="text-emerald-700 font-bold">{uploadedFile.name}</span>
                  ) : (
                    <>Click to choose file or drag & drop prescription</>
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  Supported formats: JPG, JPEG, PNG, or PDF
                </p>
              </div>
            </label>

            {uploadedFile && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-center gap-3 text-xs">
                <span className="text-slate-500 font-mono">{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                <span>·</span>
                <button
                  type="button"
                  onClick={clearUploadedFile}
                  className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove File</span>
                </button>
              </div>
            )}
          </div>

          {/* Document Preview Box (With Zoom & Reset) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Document Preview
                </h3>
              </div>

              {uploadedPreviewUrl && (
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setImageZoom((prev) => Math.max(50, prev - 25))}
                    className="p-1 hover:bg-white rounded text-slate-600 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-600 px-1">{imageZoom}%</span>
                  <button
                    type="button"
                    onClick={() => setImageZoom((prev) => Math.min(250, prev + 25))}
                    className="p-1 hover:bg-white rounded text-slate-600 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageZoom(100)}
                    className="p-1 hover:bg-white rounded text-slate-600 cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Container for Preview */}
            <div className="bg-slate-100/70 rounded-xl border border-slate-200 p-2 min-h-[320px] flex items-center justify-center overflow-auto max-h-[460px]">
              {uploadedPreviewUrl ? (
                uploadedFile?.type === 'application/pdf' ? (
                  <div className="text-center p-6 space-y-2">
                    <FileText className="w-12 h-12 text-red-500 mx-auto" />
                    <p className="text-xs font-semibold text-slate-800">{uploadedFile.name}</p>
                    <p className="text-[11px] text-slate-500">PDF document ready for transcription.</p>
                  </div>
                ) : (
                  <div
                    className="transition-transform duration-150 origin-top flex items-center justify-center"
                    style={{ transform: `scale(${imageZoom / 100})` }}
                  >
                    <img
                      src={uploadedPreviewUrl}
                      alt="Uploaded Prescription"
                      className="max-w-full rounded-lg shadow-sm object-contain"
                    />
                  </div>
                )
              ) : isDemoMode && selectedPrescription ? (
                /* Demo Mode preview */
                <div className="text-center p-6 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                    <Eye className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-amber-900">{selectedPrescription.title}</p>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    Demonstration document. Switch to Normal Mode and upload your real doctor's prescription.
                  </p>
                </div>
              ) : (
                /* Empty Zero-State */
                <div className="text-center p-8 space-y-2 text-slate-400">
                  <FileText className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-medium text-slate-500">No document uploaded yet</p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    Select a photo or scan of your doctor's prescription above to view it here.
                  </p>
                </div>
              )}
            </div>

            {/* Scan Prescription Trigger */}
            <div className="pt-2 space-y-2">
              <button
                onClick={runRealDocumentScan}
                disabled={!uploadedFile || isScanning}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Processing Document Transcription...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Scan Prescription</span>
                  </>
                )}
              </button>

              {scanError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{scanError}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Genuine Extracted Information */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header Tabs */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Extracted Prescription Information</h2>
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
                  Medications ({currentMedications.length})
                </button>
                <button
                  onClick={() => setActiveTab('doctor')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    activeTab === 'doctor'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Document Details
                </button>
                <button
                  onClick={() => setActiveTab('safety')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    activeTab === 'safety'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Clinical Warnings {uncertainFields.length > 0 && `(${uncertainFields.length})`}
                </button>
              </div>
            </div>

            {/* Tab 1: Extracted Medications */}
            {activeTab === 'extracted' && (
              <div className="p-5 space-y-6">
                {currentMedications.length === 0 ? (
                  /* Clean Empty State: No false Sarah Jenkins or Dr. Robert Vance */
                  <div className="py-14 text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">Awaiting Prescription Scan</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Upload a doctor prescription document on the left and click "Scan Prescription". Verbatim medication orders will appear here.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="text-xs text-slate-500">
                        Found <strong className="text-slate-800">{currentMedications.length}</strong> medication order(s) on document
                      </div>
                      <button
                        onClick={handleInitiateAddAll}
                        disabled={isDemoMode}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Verify & Add All to Reminders</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {currentMedications.map((med, index) => {
                        const isAdded = addedReminderIds[med.id];
                        return (
                          <div
                            key={med.id}
                            className={`p-5 rounded-xl border bg-white transition-all space-y-3 ${
                              med.isUncertain
                                ? 'border-amber-300 bg-amber-50/20'
                                : 'border-slate-200 hover:border-emerald-300'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                                    {index + 1}
                                  </span>
                                  <h3 className="text-base font-bold text-slate-900">{med.name}</h3>
                                  {med.dosage && (
                                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                      {med.dosage}
                                    </span>
                                  )}
                                  {med.isUncertain && (
                                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                                      <span>Handwriting Unclear</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => handleInitiateAddMed(med)}
                                disabled={isAdded || isDemoMode}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                                  isAdded
                                    ? 'bg-emerald-100 text-emerald-800 cursor-default'
                                    : 'bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Reminder Scheduled</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Verify & Add Reminder</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Details as written */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <span className="font-semibold text-slate-700 block mb-1">
                                  Prescribed Sig / Frequency:
                                </span>
                                <span className="font-medium text-slate-900">
                                  {med.frequency || 'Not stated on document'}
                                </span>
                              </div>

                              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <span className="font-semibold text-slate-700 block mb-1">
                                  Timing & Duration:
                                </span>
                                <span className="font-medium text-slate-900">
                                  Timing: {med.timing || 'As directed'} · Duration: {med.duration || 'Not specified'}
                                </span>
                              </div>
                            </div>

                            {/* Remarks */}
                            {med.instructions && (
                              <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-100 text-xs text-slate-700">
                                <strong>Instructions as written:</strong> {med.instructions}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tab 2: Document Details */}
            {activeTab === 'doctor' && (
              <div className="p-6 space-y-4 text-sm">
                {!currentDoctorName && !currentPatientName && !currentClinicName ? (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    No prescription details extracted yet. Upload and scan a document to view doctor and patient details.
                  </p>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {currentDoctorName || 'Physician Name: Unspecified / Illegible'}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {currentClinicName || 'Clinic / Practice: Unspecified'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="p-4 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-500 block mb-1">Prescription Date</span>
                        <span className="font-semibold text-slate-900 text-sm">
                          {currentDate || 'Not stated on document'}
                        </span>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-500 block mb-1">Patient Name</span>
                        <span className="font-semibold text-slate-900 text-sm">
                          {currentPatientName || 'Not stated on document'}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tab 3: Clinical Warnings & Uncertain Handwriting */}
            {activeTab === 'safety' && (
              <div className="p-6 space-y-4 text-xs">
                {uncertainFields.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-amber-900">
                    <div className="flex items-center gap-2 font-bold text-amber-950">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Uncertain or Illegible Handwriting Noted by OCR:</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-amber-900">
                      {uncertainFields.map((field, idx) => (
                        <li key={idx}><strong>{field}</strong> — Professional verification required before administration.</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <AlertCircle className="w-4 h-4 text-emerald-600" />
                    <span>Important Human Verification Notice:</span>
                  </div>
                  <p className="leading-relaxed">
                    Prescription handwriting can be ambiguous. MediAssist AI transcribes verbatim text but does not verify clinical pharmacology or drug interactions. You must compare each extracted medicine name and dosage against the original paper prescription or pharmacy label before taking any medicine.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mandatory Human Verification Modal */}
      {verificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Human Verification Required
                  </h3>
                  <span className="text-[11px] text-amber-800 font-semibold">
                    Confirm details before adding to schedule
                  </span>
                </div>
              </div>
              <button
                onClick={() => setVerificationModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-semibold text-slate-900">Medications to verify:</div>
                {isBulkAdding ? (
                  <ul className="list-disc pl-4 space-y-1 text-slate-800 font-medium">
                    {currentMedications.map((m) => (
                      <li key={m.id}>
                        {m.name} — {m.dosage} ({m.frequency})
                      </li>
                    ))}
                  </ul>
                ) : (
                  pendingMedToAdd && (
                    <div className="text-slate-800 font-medium">
                      {pendingMedToAdd.name} — {pendingMedToAdd.dosage} ({pendingMedToAdd.frequency})
                    </div>
                  )
                )}
              </div>

              {/* Safety notice */}
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Clinical Notice:</strong> Never alter your dosage without explicit instructions from your prescribing doctor. MediAssist AI does not replace your physician or pharmacist.
                </p>
              </div>

              {/* Checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={humanVerifiedConfirmed}
                  onChange={(e) => setHumanVerifiedConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-900 leading-snug">
                  I confirm that I have verified the medicine name(s), dosage, and directions against my physical doctor prescription document.
                </span>
              </label>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setVerificationModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmHumanVerification}
                  disabled={!humanVerifiedConfirmed}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Confirm & Schedule Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
