import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = 'https://tmgkmaxgrxwibjegfome.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtZ2ttYXhncnh3aWJqZWdmb21lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzE3MDQsImV4cCI6MjA3NzgwNzcwNH0.ZQsHCQ2YU7ViCBG-pUSQ_40I8eCGbArPLmjAc1-D71Y';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
