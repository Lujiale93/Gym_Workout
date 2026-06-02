# IronLog — Final Setup Steps

## 1. Run this SQL in Supabase → SQL Editor

```sql
-- Sessions table
CREATE TABLE sessions (
  id        uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id   uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type      text NOT NULL,
  date      timestamptz DEFAULT now(),
  exercises jsonb NOT NULL DEFAULT '[]'
);

-- Custom exercises table
CREATE TABLE custom_exercises (
  id      uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name    text NOT NULL,
  day     text NOT NULL
);

-- User meta (stores last workout type)
CREATE TABLE user_meta (
  user_id   uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  last_type text
);

-- Row level security (users only see their own data)
ALTER TABLE sessions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_meta        ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own" ON sessions         FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own" ON custom_exercises FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own" ON user_meta        FOR ALL USING (auth.uid() = user_id);
```

## 2. Enable Google OAuth in Supabase
- Authentication → Providers → Google → Enable
- Client ID:     1037891546856-2b7kj8kqancini36ivhklmrfnhqjkh98.apps.googleusercontent.com
- Client Secret: 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
- Save

## 3. Add Authorized redirect URI in Google Cloud Console
Go to: APIs & Services → Credentials → your OAuth Client → Edit
Add this to Authorized redirect URIs:
  https://nxtqqhigvnfjrkultxoi.supabase.co/auth/v1/callback

## 4. Deploy to Vercel
- Push this folder to a GitHub repo
- Import the repo on vercel.com
- Deploy (Vite is auto-detected)
- Copy your Vercel URL (e.g. https://ironlog-abc.vercel.app)

## 5. Add Vercel URL to Google Cloud Console
Add to Authorized JavaScript origins:
  https://your-vercel-url.vercel.app
Add to Authorized redirect URIs:
  https://nxtqqhigvnfjrkultxoi.supabase.co/auth/v1/callback  ← already there

## 6. Add Vercel URL to Supabase
Authentication → URL Configuration → Site URL → set to your Vercel URL
Also add it to Redirect URLs.

Done! Share your Vercel URL with friends.
