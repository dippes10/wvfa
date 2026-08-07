"use client";

import { useActionState, useState } from "react";
import { submitLoadEntry, type ActionState } from "@/lib/actions/load-actions";
import { EmojiScale, RPE_POINTS } from "./emoji-scale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { activityOptions } from "@/lib/schemas/load";

const initialState: ActionState = { error: null };

export function LoadEntryForm() {
  const [state, formAction, pending] = useActionState(submitLoadEntry, initialState);
  const [duration, setDuration] = useState(60);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="activityDate">Date</Label>
          <Input
            id="activityDate"
            name="activityDate"
            type="date"
            defaultValue={today}
            max={today}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">Activity</Label>
          <Select name="description" defaultValue={activityOptions[0]}>
            <SelectTrigger id="description" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activityOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Duration — {duration} minutes</Label>
        <Slider
          value={[duration]}
          min={5}
          max={240}
          step={5}
          onValueChange={(v) => setDuration(Array.isArray(v) ? v[0] : v)}
        />
        <input type="hidden" name="durationMinutes" value={duration} />
      </div>

      <div className="space-y-2">
        <Label>How hard did it feel?</Label>
        <EmojiScale name="rpe" points={RPE_POINTS} defaultValue={5} />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-full rounded-full">
        {pending ? "Saving…" : "Log this session"}
      </Button>
    </form>
  );
}
