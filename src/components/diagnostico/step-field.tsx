"use client";

import {
  type StepConfig,
  type Lang,
  type LangText,
  UI,
} from "@/lib/diagnostico/config";
import {
  inputStyle,
  textareaStyle,
  optionCardStyle,
  optionCardActiveStyle,
  scaleCardStyle,
} from "@/lib/diagnostico/styles";

type Answers = Record<string, unknown>;

export function StepField({
  step,
  lang,
  answers,
  setAnswer,
  onFileChange,
  fileError,
  existingFileName,
}: {
  step: StepConfig;
  lang: Lang;
  answers: Answers;
  setAnswer: (id: string, value: unknown) => void;
  onFileChange?: (file: File | null) => void;
  fileError?: string;
  existingFileName?: string;
}) {
  const t = (obj: LangText) => obj[lang];
  const value = answers[step.id];

  const toggleMulti = (v: string) => {
    const current = (answers[step.id] as string[] | undefined) || [];
    const next = current.includes(v)
      ? current.filter((o) => o !== v)
      : [...current, v];
    setAnswer(step.id, next);
  };

  if (step.type === "text" || step.type === "tel") {
    return (
      <input
        style={inputStyle}
        type={step.type === "tel" ? "tel" : "text"}
        value={(value as string) || ""}
        onChange={(e) => setAnswer(step.id, e.target.value)}
      />
    );
  }

  if (step.type === "textarea") {
    return (
      <textarea
        style={textareaStyle}
        value={(value as string) || ""}
        onChange={(e) => setAnswer(step.id, e.target.value)}
      />
    );
  }

  if (step.type === "single") {
    return (
      <>
        {step.options?.map((o) => (
          <div key={o.value}>
            <div
              style={
                value === o.value
                  ? { ...optionCardStyle, ...optionCardActiveStyle }
                  : optionCardStyle
              }
              onClick={() => setAnswer(step.id, o.value)}
            >
              {t(o.label)}
            </div>
            {o.value === "otro" && value === "otro" && step.hasOtroInline && (
              <input
                style={{ ...inputStyle, marginTop: -4, marginBottom: 10 }}
                type="text"
                placeholder={t(UI.otroPlaceholder)}
                value={(answers[step.id + "Otro"] as string) || ""}
                onChange={(e) => setAnswer(step.id + "Otro", e.target.value)}
              />
            )}
          </div>
        ))}
      </>
    );
  }

  if (step.type === "multi") {
    const selectedList = (value as string[] | undefined) || [];
    return (
      <>
        {step.options?.map((o) => {
          const selected = selectedList.includes(o.value);
          return (
            <div key={o.value}>
              <div
                style={
                  selected
                    ? { ...optionCardStyle, ...optionCardActiveStyle }
                    : optionCardStyle
                }
                onClick={() => toggleMulti(o.value)}
              >
                {selected ? "✓ " : ""}
                {t(o.label)}
              </div>
              {o.value === "otro" && selected && step.hasOtroInline && (
                <input
                  style={{ ...inputStyle, marginTop: -4, marginBottom: 10 }}
                  type="text"
                  placeholder={t(UI.otroPlaceholder)}
                  value={(answers[step.id + "Otro"] as string) || ""}
                  onChange={(e) =>
                    setAnswer(step.id + "Otro", e.target.value)
                  }
                />
              )}
            </div>
          );
        })}
      </>
    );
  }

  if (step.type === "yesno") {
    return (
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { v: "yes", l: UI.yes },
          { v: "no", l: UI.no },
        ].map((o) => (
          <div
            key={o.v}
            style={
              value === o.v
                ? {
                    ...optionCardStyle,
                    ...optionCardActiveStyle,
                    flex: 1,
                    textAlign: "center",
                  }
                : { ...optionCardStyle, flex: 1, textAlign: "center" }
            }
            onClick={() => setAnswer(step.id, o.v)}
          >
            {t(o.l)}
          </div>
        ))}
      </div>
    );
  }

  if (step.type === "scale") {
    return (
      <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
        {[
          { v: 1, emoji: "😟", label: t(UI.scaleWorst) },
          { v: 2, emoji: "🙁", label: "" },
          { v: 3, emoji: "😐", label: "" },
          { v: 4, emoji: "🙂", label: "" },
          { v: 5, emoji: "🤩", label: t(UI.scaleBest) },
        ].map((o) => (
          <div
            key={o.v}
            style={
              value === o.v
                ? { ...scaleCardStyle, ...optionCardActiveStyle }
                : scaleCardStyle
            }
            onClick={() => setAnswer(step.id, o.v)}
          >
            <div style={{ fontSize: 22 }}>{o.emoji}</div>
            {o.label && (
              <div style={{ fontSize: 9, color: "#6B6B6B", marginTop: 4 }}>
                {o.label}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (step.type === "file") {
    return (
      <>
        <input
          style={inputStyle}
          type="file"
          accept={step.acceptedTypes}
          onChange={(e) => onFileChange?.(e.target.files?.[0] || null)}
        />
        {existingFileName && (
          <div style={{ fontSize: 12, color: "#1B4D3E", marginTop: 6 }}>
            ✓ {t(UI.fileUploaded)} {existingFileName}
          </div>
        )}
        {fileError && (
          <div style={{ color: "#C0392B", fontSize: 12, marginTop: 6 }}>
            {fileError}
          </div>
        )}
      </>
    );
  }

  return null;
}
