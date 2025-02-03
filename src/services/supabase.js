import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://fvjuvykknxfqujjlkxqj.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2anV2eWtrbnhmcXVqamxreHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MzM2NjcsImV4cCI6MjA0NzUwOTY2N30.Ye1pH5PgabmCE4hPBbuBPpeKnts_n90y6CXzcbmTEHQ';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
