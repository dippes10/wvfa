import { MessageSquareQuote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  listPendingTestimonials,
  listReviewedTestimonialsPage,
} from "@/lib/services/testimonialService";
import {
  approveTestimonialAction,
  rejectTestimonialAction,
} from "@/lib/actions/testimonial-actions";
import { ReviewedTestimonialsTable } from "@/components/admin/reviewed-testimonials-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const [pending, reviewedPage] = await Promise.all([
    listPendingTestimonials(supabase),
    listReviewedTestimonialsPage(supabase),
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Author</TableHead>
                    <TableHead>Quote</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <p className="font-medium">{t.author_name}</p>
                        <p className="text-xs text-muted-foreground">{t.designation}</p>
                      </TableCell>
                      <TableCell className="max-w-sm">
                        <p className="text-muted-foreground">{t.quote}</p>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Reviewed</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewedTestimonialsTable
            initialItems={reviewedPage.items}
            initialHasMore={reviewedPage.hasMore}
          />
        </CardContent>
      </Card>
    </div>
  );
}
