import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/diagnostico/login-form";
import { DiagnosticoWizard } from "@/components/diagnostico/diagnostico-wizard";

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
