"use client";

import { usePathname } from "next/navigation";
import { TracingBeam } from "@/components/ui/tracing-beam";

// TracingBeam measures its content height once on mount. The (app) layout
// persists across client-side navigation, so without remounting per route
// the beam would keep the previous page's (wrong) height.
export function RouteTracingBeam({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <TracingBeam key={pathname} className="max-w-5xl">
      {children}
    </TracingBeam>
  );
}
