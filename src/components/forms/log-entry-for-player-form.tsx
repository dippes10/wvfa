"use client";

import { useActionState, useState } from "react";
import { logEntryForPlayerAction } from "@/lib/actions/load-actions";
import type { ActionState } from "@/lib/actions/load-actions";
import { EmojiScale, RPE_POINTS } from "./emoji-scale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export function LogEntryForPlayerForm({ playerId }: { playerId: string }) {
  const [state, formAction, pending] = useActionState(logEntryForPlayerAction, initialState);
  const [duration, setDuration] = useState(60);
  const [activity, setActivity] = useState<string>(activityOptions[0]);
  const [customActivity, setCustomActivity] = useState("");
  const isOther = activity === "Other";
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="playerId" value={playerId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="admin-activityDate">Date</Label>
          <Input
            id="admin-activityDate"
            name="activityDate"
            type="date"
            defaultValue={today}
            max={today}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="admin-description">Activity</Label>
          <Select value={activity} onValueChange={(v) => setActivity(v ?? activityOptions[0])}>
            <SelectTrigger id="admin-description" className="w-full">
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
          <input type="hidden" name="description" value={isOther ? customActivity : activity} />
        </div>
      </div>

      {isOther && (
        <div className="space-y-1.5">
          <Label htmlFor="admin-customActivity">Custom activity name</Label>
          <Input
            id="admin-customActivity"
            value={customActivity}
            onChange={(e) => setCustomActivity(e.target.value)}
            placeholder="e.g. Futsal, Speed & agility"
            maxLength={60}
            required
          />
        </div>
      )}

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
        <Label>Effort (RPE)</Label>
        <EmojiScale name="rpe" points={RPE_POINTS} defaultValue={5} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="admin-notes">
          Notes <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="admin-notes"
          name="notes"
          rows={3}
          maxLength={500}
          placeholder="e.g. sore ankle after collision"
        />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-full rounded-full">
        {pending ? "Saving…" : "Log session for this player"}
      </Button>
    </form>
  );
}
