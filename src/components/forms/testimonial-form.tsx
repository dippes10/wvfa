"use client";

import { useActionState } from "react";
import { submitTestimonialAction } from "@/lib/actions/testimonial-actions";
import type { ActionState } from "@/lib/actions/load-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = { error: null };

export function TestimonialForm({ defaultDesignation }: { defaultDesignation: string }) {
  const [state, formAction, pending] = useActionState(submitTestimonialAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="designation">Who you are</Label>
        <Input
          id="designation"
          name="designation"
          defaultValue={defaultDesignation}
          maxLength={60}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="quote">Your experience</Label>
        <Textarea
          id="quote"
          name="quote"
          rows={4}
          maxLength={600}
          placeholder="What's WVFA meant for you or your child?"
          required
        />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="rounded-full">
        {pending ? "Submitting…" : "Submit for review"}
      </Button>
    </form>
  );
}
