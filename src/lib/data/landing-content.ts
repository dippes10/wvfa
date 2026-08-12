import { LogIn, ShieldCheck, Activity, LineChart } from "lucide-react";

export const HOW_IT_WORKS = [
  {
    step: "01",
    icon: LogIn,
    title: "Sign in with Google",
    body: "Players and parents create an account in seconds — no new password to remember.",
  },
  {
    step: "02",
    icon: ShieldCheck,
    title: "Get approved",
    body: "An academy admin reviews new sign-ups and assigns the right role: player, parent, or coach.",
  },
  {
    step: "03",
    icon: Activity,
    title: "Log the day",
    body: "A minute logging training load and sleep — RPE, duration, hours, and quality.",
  },
  {
    step: "04",
    icon: LineChart,
    title: "Watch trends surface",
    body: "Weekly totals, week-over-week change, and ACWR risk zone — updated automatically.",
  },
] as const;

export const WHY_WVFA = [
  {
    title: "Player safety first",
    body: "Acute:chronic workload ratio tracking flags overtraining before it becomes an injury — the same method used by professional sports science teams.",
  },
  {
    title: "Parents stay in the loop",
    body: "Linked parent accounts see their child's load and sleep trends without needing to ask the coach for an update.",
  },
  {
    title: "One dashboard for the academy",
    body: "Coaches see every player's status at a glance — who's flagged, who's pending approval, who needs a rest day.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Is WVFA free to use?",
    answer:
      "Yes. WVFA is a training-load and sleep tracking platform built for the academy — there's no cost to players, parents, or coaches.",
  },
  {
    question: "How does approval work?",
    answer:
      "After signing in with Google, your account sits in a pending state until an academy admin reviews it and assigns you the correct role — player, parent, or coach.",
  },
  {
    question: "What is session load and ACWR?",
    answer:
      "Session load is duration × RPE (rate of perceived exertion) for a single session. ACWR compares this week's total load to the average of the previous four weeks — a ratio well outside 0.8–1.3 is a recognised injury-risk signal.",
  },
  {
    question: "Can parents see their child's data?",
    answer:
      "Yes, once an admin links a parent account to a player. Parents get read-only access to that player's load and sleep trends.",
  },
  {
    question: "What if I miss a day?",
    answer:
      "Nothing breaks — weekly totals and trends simply reflect the days that were logged. You can always add a session or a night's sleep after the fact.",
  },
] as const;

export const COVERAGE_TOWNS = [
  "Ballarat",
  "Geelong",
  "Warrnambool",
  "Colac",
  "Hamilton",
  "Ararat",
] as const;
