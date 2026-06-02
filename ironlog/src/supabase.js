import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nxtqqhigvnfjrkultxoi.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54dHFxaGlndm5manJrdWx0eG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNzgxNzMsImV4cCI6MjA5NTk1NDE3M30.MfVTexwUI5T41dJABWDx7CpeQ2v_5_rpGDujTvLJXiI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
