import { redirect } from "@/i18n/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PanelEditor } from "@/components/diagnostico/panel-editor";

export default async function DiagnosticoPanelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/diagnostico", locale });
  }

  const { data: diagnostico } = await supabase
    .from("diagnosticos")
    .select("respuestas, idioma, telegram_contacto, quiere_revision, updated_at")
    .eq("user_id", user!.id)
    .maybeSingle();

  return (
    <PanelEditor
      userId={user!.id}
      userEmail={user!.email ?? ""}
      initial={diagnostico}
    />
  );
}
