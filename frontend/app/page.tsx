"use client";

import { useState } from "react";
import { InputSection } from "@/components/input-section";
import { ResultsSection } from "@/components/results-section";
import { FileText } from "lucide-react";

export interface ExtractionResult {
  confidence: number;
  model: string;
  record_id: string;
  extracted_at: string;
  chief_complaints: string[];
  diagnosis: string;
  medications: {
    drug_name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  lab_tests: string[];
  radiology_tests: string[];
  advice: string[];
  evidence_snippets: {
    label: string;
    value: string;
  }[];
  raw_json: Record<string, unknown>;
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractionResult | null>(null);

  const handleExtract = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/extract`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: inputText }),
        },
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const out = data.structured_output;

      setResult({
        confidence: out.confidence_score ?? 0,
        model: data.model_used,
        record_id: data.id,
        extracted_at: data.created_at,
        chief_complaints: out.chief_complaints ?? [],
        diagnosis: out.diagnosis ?? "",
        medications: (out.medications ?? []).map((m: any) => ({
          drug_name: m.name,
          dosage: m.dosage ?? "",
          frequency: m.frequency ?? "",
          duration: m.duration ?? "",
        })),
        lab_tests: out.lab_tests ?? [],
        radiology_tests: out.radiology_tests ?? [],
        advice: out.advice ?? [],
        evidence_snippets: out.evidence_snippets
          ? Object.entries(out.evidence_snippets)
              .filter(([_, v]) => v)
              .map(([label, value]) => ({ label, value: value as string }))
          : [],
        raw_json: data,
      });
    } catch {
      setError(
        "Failed to connect to backend. Make sure it is running on port 8000.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/30">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-[15px] font-semibold text-foreground">
              Prescription Structurer
            </span>
          </div>
          <span className="text-[13px] text-muted-foreground">
            DocstribeAI Assignment
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-foreground mb-3">
            Medical Note Extractor
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Paste a raw prescription or clinical note. The model parses it into
            structured fields: complaints, diagnosis, medications,
            investigations, and advice.
          </p>
        </div>

        {/* Input Section */}
        <InputSection
          inputText={inputText}
          setInputText={setInputText}
          onExtract={handleExtract}
          isLoading={isLoading}
          error={error}
        />

        {/* Results Section */}
        {result && <ResultsSection result={result} />}
      </main>

      {/* Footer */}
      {!result && (
        <footer className="py-6">
          <p className="text-center text-[13px] text-muted-foreground">
            Clinical extraction powered by GPT-4o. For demonstration only; not
            for medical decision-making.
          </p>
        </footer>
      )}
    </div>
  );
}
