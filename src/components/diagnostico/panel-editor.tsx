"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  ALL_STEPS,
  BLOCKS,
  LANGS,
  Q,
  type Lang,
  type LangText,
} from "@/lib/diagnostico/config";
import { createClient } from "@/lib/supabase/client";
import { StepField } from "@/components/diagnostico/step-field";
import {
  containerStyle,
  introTitleStyle,
  introSubtitleStyle,
  blockLabelStyle,
  questionStyle,
  subtitleSmallStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
} from "@/lib/diagnostico/styles";

type Answers = Record<string, unknown>;

type DiagnosticoRow = {
  respuestas: Answers;
  idioma: string;
  telegram_contacto: string | null;
  quiere_revision: boolean;
  updated_at: string;
} | null;

export function PanelEditor({
  userEmail,
  initial,
}: {
  userId: string;
  userEmail: string;
  initial: DiagnosticoRow;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [lang, setLang] = useState<Lang>((initial?.idioma as Lang) || "es");
  const [answers, setAnswers] = useState<Answers>(initial?.respuestas || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const t = (obj: LangText) => obj[lang];
  const setAnswer = (id: string, value: unknown) => {
    setSaved(false);
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.refresh();
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const { error: updateError } = await supabase
      .from("diagnosticos")
      .update({
        respuestas: answers,
        idioma: lang,
        telegram_contacto: (answers.telegramContacto as string) || null,
        quiere_revision: answers.quiereRevision === "yes",
      })
      .eq(
        "user_id",
        (await supabase.auth.getUser()).data.user?.id as string,
      );
    setSaving(false);
    if (updateError) {
      setError("No se pudo guardar. Intenta de nuevo.");
      return;
    }
    setSaved(true);
  }

  const header = (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 13,
        color: "#6B6B6B",
      }}
    >
      <span>{userEmail}</span>
      <button
        onClick={handleSignOut}
        style={{ background: "none", border: "none", color: "#6B6B6B", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
      >
        Cerrar sesión
      </button>
    </div>
  );

  if (!initial) {
    return (
      <div style={{ minHeight: "100dvh", background: "#F8F6F2", padding: "40px 24px" }}>
        {header}
        <div style={containerStyle}>
          <div style={introTitleStyle}>Todavía no tienes un diagnóstico</div>
          <p style={introSubtitleStyle}>
            Completa el formulario para que aparezca aquí y puedas editarlo cuando quieras.
          </p>
          <Link href="/diagnostico" style={{ ...primaryButtonStyle, display: "inline-block", textDecoration: "none", marginTop: 8 }}>
            Empezar diagnóstico →
          </Link>
        </div>
      </div>
    );
  }

  const activeSteps = ALL_STEPS.filter((s) => !s.showIf || s.showIf(answers));

  return (
    <div style={{ minHeight: "100dvh", background: "#F8F6F2", padding: "40px 24px" }}>
      {header}
      <div style={{ ...containerStyle, maxWidth: 560 }}>
        <div style={introTitleStyle}>Tu diagnóstico</div>
        <p style={introSubtitleStyle}>
          Última actualización: {new Date(initial.updated_at).toLocaleString("es-MX")}
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              style={{
                border: `1.5px solid ${lang === l.code ? "#1B4D3E" : "#D8D8D8"}`,
                background: lang === l.code ? "rgba(27,77,62,0.08)" : "transparent",
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {l.flag}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {activeSteps.map((step) => {
            const qText = Q[step.id];
            return (
              <div key={step.id}>
                {step.blockKey && (
                  <div style={blockLabelStyle}>{t(BLOCKS[step.blockKey])}</div>
                )}
                <div style={questionStyle}>{t(qText.question)}</div>
                {qText.subtitle && (
                  <p style={subtitleSmallStyle}>{t(qText.subtitle)}</p>
                )}
                <div style={{ marginTop: 12 }}>
                  <StepField
                    step={step}
                    lang={lang}
                    answers={answers}
                    setAnswer={setAnswer}
                    existingFileName={
                      step.id === "documentoAdicional"
                        ? (answers.documentoAdicional as { name: string } | undefined)?.name
                        : undefined
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 16 }}>
          <button
            style={{ ...primaryButtonStyle, opacity: saving ? 0.6 : 1 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
          {saved && <span style={{ color: "#1B4D3E", fontSize: 13 }}>✓ Guardado</span>}
          {error && <span style={{ color: "#C0392B", fontSize: 13 }}>{error}</span>}
        </div>

        <div style={{ marginTop: 24 }}>
          <Link href="/diagnostico" style={secondaryButtonStyle}>
            ← Volver a hacer el diagnóstico desde cero
          </Link>
        </div>
      </div>
    </div>
  );
}
