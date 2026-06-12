import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Supabase URL:", supabaseServiceRoleKey);

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "";

export const missingSupabaseConfigKeys = [
  supabaseUrl ? null : "SUPABASE_URL",
  supabaseServiceRoleKey ? null : "SUPABASE_SERVICE_ROLE_KEY"
].filter(Boolean) as string[];

export const missingStorageConfigKeys = [
  ...missingSupabaseConfigKeys,
  STORAGE_BUCKET ? null : "SUPABASE_STORAGE_BUCKET"
].filter(Boolean) as string[];

export const hasSupabaseConfig =
  Boolean(supabaseUrl) && Boolean(supabaseServiceRoleKey);

export const hasStorageConfig = hasSupabaseConfig && Boolean(STORAGE_BUCKET);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl as string, supabaseServiceRoleKey as string)
  : null;
