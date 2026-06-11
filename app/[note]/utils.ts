import { supabase, STORAGE_BUCKET } from "@/lib/supabase";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value: string): boolean => UUID_REGEX.test(value);

export const fetchOrCreateNote = async (
  param: string
): Promise<Note | null> => {
  if (!supabase) return null;

  const column = isUuid(param) ? "id" : "slug";

  const { data: existing } = await supabase
    .from("notes")
    .select("*")
    .eq(column, param)
    .maybeSingle();

  if (existing) return existing as Note;

  // Only auto-create when the param is a UUID (freshly generated from home page)
  if (!isUuid(param)) return null;

  const { data: created } = await supabase
    .from("notes")
    .insert({ id: param, slug: param, content: "" })
    .select()
    .single();

  return (created as Note) ?? null;
};

export const saveNote = async (
  noteId: string,
  content: string
): Promise<boolean> => {
  if (!supabase) return false;

  const { error } = await supabase
    .from("notes")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", noteId);

  return !error;
};

export const uploadNoteImage = async (
  file: File,
  noteId: string
): Promise<string | null> => {
  if (!supabase) return null;

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `notes/${noteId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return null;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
};
