import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qtdxmetejikhgbxjbpli.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZHhtZXRlamlraGdieGpicGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODcyNzksImV4cCI6MjEwMDY2MzI3OX0.-4DA9_Q33A5WijVQy-J4MI-mam_TwN3aRdJ3W2ibas0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
