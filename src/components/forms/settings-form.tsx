"use client";

import { useActionState } from "react";
import { updateSettingsAction, type SettingsActionState } from "@/lib/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AcademySettings } from "@/lib/services/settingsService";

const initialState: SettingsActionState = { error: null };

export function SettingsForm({ settings }: { settings: AcademySettings }) {
  const [state, formAction, pending] = useActionState(updateSettingsAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="hardRpeThreshold">Hard session RPE threshold</Label>
          <Input
            id="hardRpeThreshold"
            name="hardRpeThreshold"
            type="number"
            min={1}
            max={10}
            defaultValue={settings.hard_rpe_threshold}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="maxHardSessionsWeek">Max hard sessions / week</Label>
          <Input
            id="maxHardSessionsWeek"
            name="maxHardSessionsWeek"
            type="number"
            min={1}
            max={7}
            defaultValue={settings.max_hard_sessions_week}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="guidedModeAgeCutoff">Guided-entry age cutoff</Label>
          <Input
            id="guidedModeAgeCutoff"
            name="guidedModeAgeCutoff"
            type="number"
            min={0}
            max={25}
            defaultValue={settings.guided_mode_age_cutoff}
            required
          />
        </div>
        <div className="hidden sm:block" />
        <div className="space-y-1.5">
          <Label htmlFor="sleepTargetMinHours">Sleep target — min hours</Label>
          <Input
            id="sleepTargetMinHours"
            name="sleepTargetMinHours"
            type="number"
            step={0.5}
            min={0}
            max={24}
            defaultValue={settings.sleep_target_min_hours}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sleepTargetMaxHours">Sleep target — max hours</Label>
          <Input
            id="sleepTargetMaxHours"
            name="sleepTargetMaxHours"
            type="number"
            step={0.5}
            min={0}
            max={24}
            defaultValue={settings.sleep_target_max_hours}
            required
          />
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-primary">Settings saved.</p>}

      <Button type="submit" disabled={pending} className="rounded-full">
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
