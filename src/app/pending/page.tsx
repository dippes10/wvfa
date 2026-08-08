import { Hourglass } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default function PendingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-accent/10 via-background to-primary/10 p-6">
      <Card className="w-full max-w-sm rounded-3xl border-2 text-center shadow-lg">
        <CardHeader className="items-center">
          <div className="mb-2 flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Hourglass className="size-7" />
          </div>
          <CardTitle className="text-2xl">Almost there!</CardTitle>
          <CardDescription>
            Your account is waiting for a WVFA admin to approve it. This usually only takes a
            little while — check back soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignOutButton className="mx-auto" />
        </CardContent>
      </Card>
    </main>
  );
}
