"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { ExtractionResult } from "@/app/page"

interface Props {
  result: ExtractionResult
}

export function ResultsSection({ result }: Props) {
  const [jsonExpanded, setJsonExpanded] = useState(false)
  const confidence = Math.round(result.confidence * 100)

  return (
    <div className="mt-8 space-y-4">
      {/* Confidence Bar */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
            Extraction Confidence
          </span>
          <span className="text-[15px] font-semibold text-emerald-400">{confidence}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Meta Pills */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Model</span>
          <span className="text-[13px] font-medium text-foreground">{result.model}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Record ID</span>
          <span className="text-[13px] font-mono text-foreground">{result.record_id}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Extracted At</span>
          <span className="text-[13px] text-foreground">{result.extracted_at}</span>
        </div>
      </div>

      {/* Chief Complaints & Diagnosis */}
      <div className="grid md:grid-cols-2 gap-4">
        {result.chief_complaints.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Chief Complaints
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.chief_complaints.map((complaint, i) => (
                <span 
                  key={i}
                  className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[13px] rounded-md"
                >
                  {complaint}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Diagnosis
          </h3>
          <p className="text-[15px] text-foreground">{result.diagnosis}</p>
        </div>
      </div>

      {/* Medications */}
      {result.medications.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Medications
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider pb-3">Drug Name</th>
                  <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider pb-3">Dosage</th>
                  <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider pb-3">Frequency</th>
                  <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider pb-3">Duration</th>
                </tr>
              </thead>
              <tbody>
                {result.medications.map((med, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-3 text-[14px] text-foreground">{med.drug_name}</td>
                    <td className="py-3 text-[14px] text-cyan-400 font-medium">{med.dosage}</td>
                    <td className="py-3 text-[14px] text-muted-foreground">{med.frequency}</td>
                    <td className="py-3 text-[14px] text-muted-foreground">{med.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lab & Radiology Tests */}
      {(result.lab_tests.length > 0 || result.radiology_tests.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {result.lab_tests.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Lab Tests
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.lab_tests.map((test, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[13px] rounded-md"
                  >
                    {test}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.radiology_tests.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Radiology
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.radiology_tests.map((test, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[13px] rounded-md"
                  >
                    {test}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Advice */}
      {result.advice.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Advice
          </h3>
          <ul className="space-y-2">
            {result.advice.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[14px] text-foreground">
                <span className="text-emerald-400 mt-0.5">+</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Evidence Snippets */}
      {result.evidence_snippets && result.evidence_snippets.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Evidence Snippets
          </h3>
          <div className="space-y-3">
            {result.evidence_snippets.map((snippet, i) => (
              <div key={i} className="border-l-2 border-primary pl-4">
                <span className="text-[12px] text-muted-foreground uppercase tracking-wider">{snippet.label}</span>
                <p className="text-[13px] font-mono text-foreground/80 mt-1">{snippet.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw JSON */}
      <div className="bg-card border border-border rounded-lg">
        <button
          onClick={() => setJsonExpanded(!jsonExpanded)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors rounded-lg"
        >
          <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
            Raw JSON Response
          </span>
          {jsonExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {jsonExpanded && (
          <div className="px-5 pb-5">
            <pre className="p-4 bg-muted rounded-md overflow-x-auto">
              <code className="text-[12px] font-mono text-emerald-400 leading-relaxed">
                {JSON.stringify(result.raw_json, null, 2)}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
