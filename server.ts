import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Payload limit for prescription photos/scans
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'MediAssist AI Full-Stack Server',
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Multimodal Prescription Scanner Endpoint
app.post('/api/scan-prescription', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'No prescription document or image payload was provided. Please upload a file to scan.',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        error: 'Gemini API key is not configured on the server. Please check server environment settings.',
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const systemInstruction = `You are an OCR and transcription assistant for doctor's prescriptions.
Your task is to transcribe ONLY what is visibly written or printed on the uploaded prescription image.

CRITICAL SAFETY & EXTRACTION RULES:
1. Extract ONLY information that is visibly present on the document.
2. If a doctor name, patient name, clinic name, or date cannot be clearly read or is missing, set its value to null.
3. NEVER invent a patient name, doctor name, clinic, or date.
4. For each medication found, transcribe:
   - medicine_name_as_written: Exact medication or active substance name as written on the paper. If unreadable, write "Unreadable text".
   - dosage_as_written: The exact strength or dosage as written (e.g. "500mg", "10 mg"). If absent or illegible, set to null.
   - frequency_as_written: The exact Sig or frequency instruction as written (e.g. "b.i.d.", "1 tab daily", "q.d."). If absent, set to null.
   - timing_as_written: Any explicit time of day written (e.g. "morning", "bedtime", "after meals"). If not stated, set to null.
   - duration_as_written: Exact duration as written (e.g. "7 days", "1 month"). If not stated, set to null.
   - additional_instructions_as_written: Any cautionary remarks visibly written by the doctor (e.g. "with water", "finish all"). If not present, set to null.
5. NEVER invent missing dosage, frequency, or instructions.
6. Do NOT guess or extrapolate information from surrounding context.
7. If any handwriting, word, dose, or symbol is blurred, ambiguous, cut off, or illegible, list it explicitly in uncertain_or_unreadable_fields with a brief description.`;

    const contents = [
      {
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: cleanBase64,
        },
      },
      {
        text: 'Transcribe this uploaded prescription document into structured JSON. Extract only text visibly written on the page. Set unreadable or missing values to null and list all unclear handwriting in uncertain_or_unreadable_fields.',
      },
    ];

    const ocrModels = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let response: any = null;
    let lastOcrError: any = null;

    for (const modelName of ocrModels) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: { parts: contents },
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                doctor_name: { type: Type.STRING, nullable: true },
                patient_name: { type: Type.STRING, nullable: true },
                clinic_name: { type: Type.STRING, nullable: true },
                prescription_date: { type: Type.STRING, nullable: true },
                medications: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      medicine_name_as_written: { type: Type.STRING },
                      dosage_as_written: { type: Type.STRING, nullable: true },
                      frequency_as_written: { type: Type.STRING, nullable: true },
                      timing_as_written: { type: Type.STRING, nullable: true },
                      duration_as_written: { type: Type.STRING, nullable: true },
                      additional_instructions_as_written: { type: Type.STRING, nullable: true },
                      is_uncertain: { type: Type.BOOLEAN, nullable: true },
                    },
                    required: ['medicine_name_as_written'],
                  },
                },
                uncertain_or_unreadable_fields: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['medications', 'uncertain_or_unreadable_fields'],
            },
          },
        });
        if (response && response.text) {
          break;
        }
      } catch (modelErr: any) {
        lastOcrError = modelErr;
        console.warn(`OCR model ${modelName} returned error:`, modelErr?.message || modelErr);
      }
    }

    if (!response || !response.text) {
      throw lastOcrError || new Error('OCR service temporarily unavailable across all candidates.');
    }

    const parsedData = JSON.parse(response.text || '{}');

    // Return the genuine extracted document data
    return res.json({
      success: true,
      extraction: {
        doctor_name: parsedData.doctor_name || null,
        patient_name: parsedData.patient_name || null,
        clinic_name: parsedData.clinic_name || null,
        prescription_date: parsedData.prescription_date || null,
        medications: Array.isArray(parsedData.medications)
          ? parsedData.medications.map((m: any, idx: number) => ({
              id: `med-${Date.now()}-${idx}`,
              medicine_name_as_written: m.medicine_name_as_written || 'Unspecified',
              dosage_as_written: m.dosage_as_written || null,
              frequency_as_written: m.frequency_as_written || null,
              timing_as_written: m.timing_as_written || null,
              duration_as_written: m.duration_as_written || null,
              additional_instructions_as_written: m.additional_instructions_as_written || null,
              is_uncertain: Boolean(m.is_uncertain),
            }))
          : [],
        uncertain_or_unreadable_fields: Array.isArray(parsedData.uncertain_or_unreadable_fields)
          ? parsedData.uncertain_or_unreadable_fields
          : [],
      },
    });
  } catch (err: any) {
    console.error('OCR Extraction error in /api/scan-prescription:', err);
    // NEVER return mock data! Return the genuine error
    return res.status(500).json({
      success: false,
      error: `Prescription OCR failed: ${err.message || 'Unable to parse document'}. Please ensure the image is clear and legible.`,
    });
  }
});

// Voice & Text Health Assistant Endpoint
app.post('/api/voice-assistant', async (req, res) => {
  try {
    const { query, activeMedications } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        answer: 'Gemini API key is not configured on the server. Please consult your physician or pharmacist for medical advice.',
        source: 'server-unconfigured',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }

    const medicationsContext = Array.isArray(activeMedications) && activeMedications.length > 0
      ? `Patient's confirmed medications:\n` +
        activeMedications
          .map((m: any) => `- ${m.name || m.medicine_name_as_written} (${m.dosage || m.dosage_as_written || 'unspecified dose'}): ${m.frequency || m.frequency_as_written || 'as directed'}`)
          .join('\n')
      : 'No active medications on record.';

    const systemInstruction = `You are MediAssist AI, an educational healthcare transcription and prescription reading aid.
IMPORTANT SAFETY INSTRUCTIONS:
1. You are an educational tool, NOT a doctor or medical device.
2. NEVER modify dosages, change prescriptions, or recommend treatments.
3. If asked about taking or stopping drugs, explicitly advise consulting the prescribing physician or licensed pharmacist.
4. Explain common medical abbreviations (like b.i.d. = twice daily) in plain, cautious language.
5. Do NOT state that drug interactions were clinically evaluated unless confirmed by a certified pharmacist.
${medicationsContext}`;

    const voiceCandidates = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let response: any = null;
    let usedModel = 'gemini-flash-latest';

    for (const modelName of voiceCandidates) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: `User Query: "${query}"`,
          config: {
            systemInstruction,
          },
        });
        if (response && response.text) {
          usedModel = modelName;
          break;
        }
      } catch (err: any) {
        console.warn(`Voice candidate ${modelName} returned error:`, err?.message || err);
      }
    }

    const answer = response?.text || 'Always consult your prescribing doctor or pharmacist regarding specific medication instructions.';

    res.json({
      answer: answer.trim(),
      source: usedModel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (err: any) {
    console.error('Error in /api/voice-assistant:', err);
    res.json({
      answer: 'Unable to connect to the medical assistant service at this moment. Please consult your pharmacist or prescribing doctor for medical advice.',
      source: 'error-fallback',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }
});

// Development vs Production Setup
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MediAssist AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start MediAssist AI server:', err);
  process.exit(1);
});
