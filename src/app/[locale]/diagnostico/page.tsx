import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/diagnostico/login-form";
import { DiagnosticoWizard } from "@/components/diagnostico/diagnostico-wizard";

export const metadata: Metadata = {
  title: "Diagnóstico de Marketing — Creativa Balam",
  description:
    "Diagnóstico gratuito de marketing para tu negocio, hecho por Creativa Balam.",
};

export default async function DiagnosticoPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LoginForm />;
  }

  return <DiagnosticoWizard userId={user.id} userEmail={user.email ?? ""} />;
}
