import { NextResponse } from "next/server";
import {
  hasSupabaseConfig,
  missingSupabaseConfigKeys,
  supabase
} from "@/lib/supabase";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isUuid = (value: string): boolean => UUID_REGEX.test(value);
const noteColumns = "id,slug,content,updated_at";

type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  message?: string;
};

type RequestBody = {
  action?: string;
  [key: string]: unknown;
};

type ActionHandler = (body: RequestBody) => Promise<NextResponse>;

const response = <T>(payload: ApiResponse<T>, status = 200) =>
  NextResponse.json(payload, { status });

const getIdentifier = (value: unknown): string | null => {
  return typeof value === "string" && value.trim() ? value : null;
};

const handleFetchOrCreateNote: ActionHandler = async (body) => {
  const param = getIdentifier(body.param);
  if (!param) {
    return response({ ok: false, message: "param is required" }, 400);
  }

  const column = isUuid(param) ? "id" : "slug";

  const { data: existing } = await supabase!
    .from("notes")
    .select(noteColumns)
    .eq(column, param)
    .maybeSingle();

  if (existing) {
    return response({ ok: true, data: existing as Note });
  }

  const generatedId = crypto.randomUUID();
  const noteId = isUuid(param) ? param : generatedId;
  const noteSlug = param;

  const { data: created, error: createError } = await supabase!
    .from("notes")
    .insert({ id: noteId, slug: noteSlug, content: "" })
    .select(noteColumns)
    .single();

  if (created) {
    return response({ ok: true, data: created as Note });
  }

  if (!createError) {
    return response({ ok: false, message: "Unable to create note" }, 500);
  }

  const { data: afterInsert } = await supabase!
    .from("notes")
    .select(noteColumns)
    .eq(column, param)
    .maybeSingle();

  if (!afterInsert) {
    return response({ ok: false, message: "Unable to find note" }, 404);
  }

  return response({ ok: true, data: afterInsert as Note });
};

const handleSaveNote: ActionHandler = async (body) => {
  const noteIdOrSlug = getIdentifier(body.noteIdOrSlug);
  const content = typeof body.content === "string" ? body.content : null;

  if (!noteIdOrSlug || content === null) {
    return response(
      { ok: false, message: "noteIdOrSlug and content are required" },
      400
    );
  }

  const column = isUuid(noteIdOrSlug) ? "id" : "slug";

  const { error } = await supabase!
    .from("notes")
    .update({ content, updated_at: new Date().toISOString() })
    .eq(column, noteIdOrSlug);

  return response({ ok: true, data: !error });
};

const handleCheckSlugExists: ActionHandler = async (body) => {
  const slug = getIdentifier(body.slug);
  const excludeId = getIdentifier(body.excludeId);

  if (!slug) {
    return response({ ok: false, message: "slug is required" }, 400);
  }

  let query = supabase!
    .from("notes")
    .select("id", { count: "exact", head: true })
    .eq("slug", slug);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { count, error } = await query;

  return response({ ok: true, data: !error && (count ?? 0) > 0 });
};

const handleUpdateNoteSlug: ActionHandler = async (body) => {
  const noteIdOrSlug = getIdentifier(body.noteIdOrSlug);
  const newSlug = getIdentifier(body.newSlug);

  if (!noteIdOrSlug || !newSlug) {
    return response(
      { ok: false, message: "noteIdOrSlug and newSlug are required" },
      400
    );
  }

  const column = isUuid(noteIdOrSlug) ? "id" : "slug";

  const { error } = await supabase!
    .from("notes")
    .update({ slug: newSlug, updated_at: new Date().toISOString() })
    .eq(column, noteIdOrSlug);

  return response({ ok: true, data: !error });
};

const handleUpdateNotePassword: ActionHandler = async (body) => {
  const noteIdOrSlug = getIdentifier(body.noteIdOrSlug);
  const password =
    typeof body.password === "string" || body.password === null
      ? body.password
      : undefined;

  if (!noteIdOrSlug || password === undefined) {
    return response(
      { ok: false, message: "noteIdOrSlug and password are required" },
      400
    );
  }

  const column = isUuid(noteIdOrSlug) ? "id" : "slug";

  const { error } = await supabase!
    .from("notes")
    .update({ password, updated_at: new Date().toISOString() })
    .eq(column, noteIdOrSlug);

  return response({ ok: true, data: !error });
};

const handleCheckExistAndProtected: ActionHandler = async (body) => {
  const noteIdOrSlug = getIdentifier(body.noteIdOrSlug);

  if (!noteIdOrSlug) {
    return response({ ok: false, message: "noteIdOrSlug is required" }, 400);
  }

  const column = isUuid(noteIdOrSlug) ? "id" : "slug";

  const { count: existingCount, error: existingError } = await supabase!
    .from("notes")
    .select("id", { count: "exact", head: true })
    .eq(column, noteIdOrSlug);

  if (existingError || !existingCount) {
    return response({
      ok: true,
      data: { exists: false, isProtected: false }
    });
  }

  const { count: protectedCount, error: protectedError } = await supabase!
    .from("notes")
    .select("id", { count: "exact", head: true })
    .eq(column, noteIdOrSlug)
    .not("password", "is", null);

  if (protectedError) {
    return response({
      ok: true,
      data: { exists: true, isProtected: false }
    });
  }

  return response({
    ok: true,
    data: { exists: true, isProtected: (protectedCount ?? 0) > 0 }
  });
};

const handleUnlockNote: ActionHandler = async (body) => {
  const noteIdOrSlug = getIdentifier(body.noteIdOrSlug);
  const password = getIdentifier(body.password);

  if (!noteIdOrSlug || !password) {
    return response(
      { ok: false, message: "noteIdOrSlug and password are required" },
      400
    );
  }

  const column = isUuid(noteIdOrSlug) ? "id" : "slug";

  const { data, error } = await supabase!
    .from("notes")
    .select(noteColumns)
    .eq(column, noteIdOrSlug)
    .eq("password", password)
    .maybeSingle();

  if (error || !data) {
    return response({ ok: true, data: null });
  }

  return response({ ok: true, data });
};

const handlers: Record<string, ActionHandler> = {
  fetchOrCreateNote: handleFetchOrCreateNote,
  saveNote: handleSaveNote,
  checkSlugExists: handleCheckSlugExists,
  updateNoteSlug: handleUpdateNoteSlug,
  updateNotePassword: handleUpdateNotePassword,
  checkExistAndProtected: handleCheckExistAndProtected,
  unlockNote: handleUnlockNote
};

export async function POST(request: Request) {
  if (!hasSupabaseConfig || !supabase) {
    return response(
      {
        ok: false,
        message: `Supabase server config is missing: ${missingSupabaseConfigKeys.join(", ")}`
      },
      503
    );
  }

  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return response({ ok: false, message: "Invalid request body" }, 400);
  }

  if (!body.action) {
    return response({ ok: false, message: "action is required" }, 400);
  }

  const handler = handlers[body.action];

  if (!handler) {
    return response({ ok: false, message: "Unsupported action" }, 400);
  }

  try {
    return await handler(body);
  } catch {
    return response({ ok: false, message: "Internal server error" }, 500);
  }
}
