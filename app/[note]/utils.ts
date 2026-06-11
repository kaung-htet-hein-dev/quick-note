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

  const generatedId =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const noteId = isUuid(param) ? param : generatedId;
  const noteSlug = param;

  const { data: created, error: createError } = await supabase
    .from("notes")
    .insert({ id: noteId, slug: noteSlug, content: "" })
    .select()
    .single();

  if (created) return created as Note;
  if (!createError) return null;

  // If insert failed due to a race condition (created elsewhere), fetch again.
  const { data: afterInsert } = await supabase
    .from("notes")
    .select("*")
    .eq(column, param)
    .maybeSingle();

  return (afterInsert as Note) ?? null;
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

export const checkSlugExists = async (
  slug: string,
  excludeId?: string
): Promise<boolean> => {
  if (!supabase) return false;

  let query = supabase
    .from("notes")
    .select("id", { count: "exact" })
    .eq("slug", slug);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { count, error } = await query;

  return !error && count !== null && count > 0;
};

export const updateNoteSlug = async (
  noteIdOrSlug: string,
  newSlug: string
): Promise<boolean> => {
  if (!supabase) return false;

  const column = isUuid(noteIdOrSlug) ? "id" : "slug";

  const { error } = await supabase
    .from("notes")
    .update({ slug: newSlug, updated_at: new Date().toISOString() })
    .eq(column, noteIdOrSlug);

  return !error;
};
