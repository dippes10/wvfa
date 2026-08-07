import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/services/settingsService";
import { SettingsForm } from "@/components/forms/settings-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const settings = await getSettings(supabase);

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 pb-24 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">⚙️ Academy Settings</h1>
        <p className="text-muted-foreground">
          These thresholds drive the risk warnings players, parents, and this overview see.
        </p>
      </div>
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Thresholds</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}
