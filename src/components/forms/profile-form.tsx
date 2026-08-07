"use client";

import { useActionState } from "react";
import { submitProfileUpdate } from "@/lib/actions/profile-actions";
import type { ActionState } from "@/lib/actions/load-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/lib/services/userService";

const initialState: ActionState = { error: null };

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(submitProfileUpdate, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" defaultValue={profile.full_name ?? ""} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="dateOfBirth">Date of birth</Label>
        <Input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          defaultValue={profile.date_of_birth ?? ""}
        />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="rounded-full">
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
