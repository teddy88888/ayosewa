import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://auspwnxcmpknehxlykga.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1c3B3bnhjbXBrbmVoeGx5a2dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MjE5MjQsImV4cCI6MjA5MTQ5NzkyNH0.21ViIJvJsc7jfGJTkbL2zqbt0Qu-_i88hqVxXoOezkM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
