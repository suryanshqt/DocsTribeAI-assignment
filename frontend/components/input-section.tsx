"use client";

const SAMPLES = {
  clean: {
    label: "Clean Note",
    preview: "Pt c/o HA x3d, fever x2d...",
    text: `Pt c/o HA x3d, fever x2d, sore throat.
O/E: T=100.4F, BP 120/80, P 88/min. Throat: mild erythema, no exudate.
Dx: Acute viral pharyngitis.

Rx:
1. T. Paracetamol 500mg TDS x5d
2. T. Azithromycin 500mg OD x3d
3. T. Chlorpheniramine 4mg HS x3d

Lab: CBC, throat swab C/S
Advice: Rest, warm saline gargles, plenty of fluids. F/U in 5 days if not better.`,
  },
  shorthand: {
    label: "Shorthand",
    preview: "45M c/o cough x5d w/ fever...",
    text: `45M c/o cough x5d w/ fever
Dx: Acute bronchitis
Rx: Amox 500 1x3 x7d, PCM 650 PRN
Inv: CBC CRP CXR
F/U 1wk`,
  },
  minimal: {
    label: "Minimal",
    preview: "cough fever 5d, amox 500mg...",
    text: `cough fever 5d
amox 500mg tid 7d
paracetamol prn
cxr cbc`,
  },
};

interface Props {
  inputText: string;
  setInputText: (text: string) => void;
  onExtract: () => void;
  isLoading: boolean;
  error: string | null;
}

export function InputSection({
  inputText,
  setInputText,
  onExtract,
  isLoading,
  error,
}: Props) {
  const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const chars = inputText.length;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[19px] font-medium text-muted-foreground uppercase tracking-wider">
          Input Text
        </span>
      </div>

      {/* Examples label + Sample buttons */}
      <div className="mb-4">
        <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
          Examples
        </span>
        <div className="flex gap-3">
          {(Object.keys(SAMPLES) as Array<keyof typeof SAMPLES>).map((key) => {
            const sample = SAMPLES[key];
            const isActive = inputText === sample.text;
            return (
              <button
                key={key}
                onClick={() => setInputText(sample.text)}
                className={`flex flex-col items-start gap-1 px-3 py-2.5 rounded-md border transition-colors text-left w-full
                  ${
                    isActive
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "bg-secondary border-border hover:bg-secondary/80 text-foreground"
                  }`}
              >
                <span className="text-[12px] font-semibold uppercase tracking-wider">
                  {sample.label}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono leading-snug">
                  {sample.preview}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste raw prescription or doctor note here..."
        rows={10}
        className="w-full bg-muted border border-border rounded-md p-4 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-y font-mono leading-relaxed"
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
          <span>
            <span className="text-foreground font-medium">{words}</span> words
          </span>
          <span className="text-border">|</span>
          <span>
            <span className="text-foreground font-medium">{chars}</span> chars
          </span>
        </div>
        <button
          onClick={onExtract}
          disabled={!inputText.trim() || isLoading}
          className="text-[14px] font-medium px-5 py-2.5 rounded-md bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          {isLoading ? "Extracting..." : "Extract Structure"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-md">
          <p className="text-[13px] text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
