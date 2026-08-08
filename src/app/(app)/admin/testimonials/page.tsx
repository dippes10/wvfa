import { MessageSquareQuote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  listPendingTestimonials,
  listReviewedTestimonials,
} from "@/lib/services/testimonialService";
import {
  approveTestimonialAction,
  rejectTestimonialAction,
} from "@/lib/actions/testimonial-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusVariant: Record<string, "default" | "destructive"> = {
  approved: "default",
  rejected: "destructive",
};

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const [pending, reviewed] = await Promise.all([
    listPendingTestimonials(supabase),
    listReviewedTestimonials(supabase),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24 sm:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <MessageSquareQuote className="size-6 text-primary" />
          Testimonials
        </h1>
        <p className="text-muted-foreground">Approve quotes before they appear on the landing page.</p>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">
            Pending review {pending.length > 0 && <Badge className="ml-2">{pending.length}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing waiting on you right now.</p>
          ) : (
            <ul className="space-y-3">
              {pending.map((t) => (
                <li key={t.id} className="space-y-3 rounded-xl border p-4">
                  <div>
                    <p className="font-medium">
                      {t.author_name} <span className="text-muted-foreground">— {t.designation}</span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{t.quote}</p>
                  </div>
                  <div className="flex gap-2">
                    <form action={approveTestimonialAction.bind(null, t.id)}>
                      <Button type="submit" size="sm" className="rounded-full">
                        Approve
                      </Button>
                    </form>
                    <form action={rejectTestimonialAction.bind(null, t.id)}>
                      <Button type="submit" size="sm" variant="ghost">
                        Reject
                      </Button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Reviewed</CardTitle>
        </CardHeader>
        <CardContent>
          {reviewed.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviewed testimonials yet.</p>
          ) : (
            <ul className="space-y-2">
              {reviewed.map((t) => (
                <li
                  key={t.id}
                  className="flex items-start justify-between gap-3 rounded-xl border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {t.author_name} <span className="text-muted-foreground">— {t.designation}</span>
                    </p>
                    <p className="line-clamp-2 text-muted-foreground">{t.quote}</p>
                  </div>
                  <Badge variant={statusVariant[t.status]} className="shrink-0">
                    {t.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
