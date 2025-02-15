
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://jwdapguaoueiqkryyfkd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3ZGFwZ3Vhb3VlaXFrcnl5ZmtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMzg3NDgsImV4cCI6MjA1NDgxNDc0OH0.mi5RlffM3LY47d885VqcCHb6ffoAWcBFWltTZuG0WxU";

export const supabase = createClient(supabaseUrl, supabaseKey);
