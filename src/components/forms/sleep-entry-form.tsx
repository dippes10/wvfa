"use client";

import { useActionState, useState } from "react";
import { submitSleepEntry } from "@/lib/actions/sleep-actions";
import type { ActionState } from "@/lib/actions/load-actions";
import { EmojiScale, SLEEP_QUALITY_POINTS } from "./emoji-scale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const initialState: ActionState = { error: null };

export function SleepEntryForm() {
  const [state, formAction, pending] = useActionState(submitSleepEntry, initialState);
  const [duration, setDuration] = useState(9);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="entryDate">Date</Label>
        <Input
          id="entryDate"
          name="entryDate"
          type="date"
          defaultValue={today}
          max={today}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Hours slept — {duration}h</Label>
        <Slider
          value={[duration]}
          min={0}
          max={12}
          step={0.25}
          onValueChange={(v) => setDuration(Array.isArray(v) ? v[0] : v)}
        />
        <input type="hidden" name="durationHours" value={duration} />
      </div>

      <div className="space-y-2">
        <Label>How did you sleep?</Label>
        <EmojiScale name="quality" points={SLEEP_QUALITY_POINTS} defaultValue={7} />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-full rounded-full">
        {pending ? "Saving…" : "Log last night"}
      </Button>
    </form>
  );
}
