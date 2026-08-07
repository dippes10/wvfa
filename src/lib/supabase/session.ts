import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database, UserRole } from "./database.types";

function roleHome(role: UserRole): string {
  switch (role) {
    case "head_admin":
      return "/admin";
    case "parent":
      return "/parent";
    case "player":
      return "/dashboard";
  }
}

const PUBLIC_PATHS = new Set(["/", "/login"]);

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname.startsWith("/auth");

  if (!user) {
    if (PUBLIC_PATHS.has(pathname) || isAuthRoute) return supabaseResponse;
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthRoute) return supabaseResponse;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,status")
    .eq("id", user.id)
    .single();

  // Trigger hasn't inserted the profile row yet (rare race right after sign-up).
  if (!profile) return supabaseResponse;

  if (profile.status === "pending") {
    if (pathname === "/pending") return supabaseResponse;
    const url = request.nextUrl.clone();
    url.pathname = "/pending";
    return NextResponse.redirect(url);
  }

  const home = roleHome(profile.role);

  if (pathname === "/" || pathname === "/login" || pathname === "/pending") {
    const url = request.nextUrl.clone();
    url.pathname = home;
    return NextResponse.redirect(url);
  }

  const roleSections: Record<UserRole, string> = {
    head_admin: "/admin",
    parent: "/parent",
    player: "/dashboard",
  };
  const allowedSection = roleSections[profile.role];
  const otherSections = Object.values(roleSections).filter((s) => s !== allowedSection);
  const isInOtherSection = otherSections.some((s) => pathname.startsWith(s));

  if (isInOtherSection) {
    const url = request.nextUrl.clone();
    url.pathname = home;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
