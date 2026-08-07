# WVFA — Setup

The app is fully built. These are the one-time manual steps that need your own
Supabase and Google accounts — Claude can't create these for you.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com), create a new project (any region close to
   Victoria, Australia works best).
2. In **Project Settings → API**, copy the **Project URL** and **anon public** key.
3. Copy `.env.local.example` to `.env.local` and paste those two values in:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```

## 2. Run the database migration

Easiest path — paste the SQL directly:

1. In the Supabase dashboard, open **SQL Editor**.
2. Paste the entire contents of `supabase/migrations/0001_init.sql` and run it.

Or, with the Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

This creates the `profiles`, `guardians_players`, `load_entries`, `sleep_entries`,
and `academy_settings` tables, all Row Level Security policies, the new-user
trigger, and enables Realtime on the tables the app subscribes to.

## 3. Set up Google Sign-In

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
   create an **OAuth 2.0 Client ID** (type: Web application).
2. Add this authorized redirect URI (find your project ref in the Supabase URL):

   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

3. In the Supabase dashboard, go to **Authentication → Providers → Google**, enable it,
   and paste in the **Client ID** and **Client Secret** from step 1.
4. Under **Authentication → URL Configuration**, set:
   - **Site URL**: your production URL (or `http://localhost:3000` while developing)
   - **Redirect URLs**: add `http://localhost:3000/auth/callback` (and your production
     `https://yourdomain.com/auth/callback` once deployed)

## 4. Run the app and bootstrap the first admin

```bash
npm run dev
```

1. Open `http://localhost:3000`, click **Get started**, sign in with Google.
2. You'll land on the "Almost there!" pending screen — that's expected, every new
   sign-in starts as a pending player.
3. In the Supabase **SQL Editor**, run this once, using the email you just signed in
   with, to make yourself the head admin:

   ```sql
   update public.profiles
   set role = 'head_admin', status = 'active'
   where email = 'you@example.com';
   ```

4. Refresh the app — you'll land in `/admin`. From here on, everything is done through
   the admin UI: approve new sign-ups at **Users**, assign `player` or `parent` roles,
   link parents to their kids, and tune the load/sleep thresholds at **Settings**.

## 5. Deploying

The app is a standard Next.js app — deploys cleanly to
[Vercel](https://vercel.com/new). Set the two env vars from step 1 in your
Vercel project settings, and add your production `/auth/callback` URL to Supabase's
redirect URLs (step 3.4) before going live.

## Notes

- `src/lib/supabase/database.types.ts` is hand-written to match the migration. Once
  linked, you can regenerate it from the live schema with:

  ```bash
  npx supabase gen types typescript --linked > src/lib/supabase/database.types.ts
  ```

- All access control is enforced by Postgres Row Level Security (see the policies in
  `supabase/migrations/0001_init.sql`), not just app-level checks — even a raw API
  call with a user's token can't read or write data outside their role.
