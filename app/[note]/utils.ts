const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value: string): boolean => UUID_REGEX.test(value);

type NoteApiResponse<T> = {
  ok: boolean;
  data?: T;
  message?: string;
};

const postNoteApi = async <T>(payload: unknown): Promise<T | null> => {
  try {
    const response = await fetch("/api/note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return null;
    }

    const result = (await response.json()) as NoteApiResponse<T>;

    if (!result.ok || result.data === undefined) {
      return null;
    }

    return result.data;
  } catch {
    return null;
  }
};

export const fetchOrCreateNote = async (
  param: string
): Promise<Note | null> => {
  return postNoteApi<Note>({ action: "fetchOrCreateNote", param });
};

export const saveNote = async (
  noteID: string,
  content: string
): Promise<boolean> => {
  const result = await postNoteApi<boolean>({
    action: "saveNote",
    noteIdOrSlug: noteID,
    content
  });

  return result === true;
};

export const uploadNoteImage = async (
  file: File,
  noteID: string
): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("noteIdOrSlug", noteID);

    const response = await fetch("/api/note/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      return null;
    }

    const result = (await response.json()) as NoteApiResponse<{
      publicUrl: string;
    }>;

    if (!result.ok || !result.data?.publicUrl) {
      return null;
    }

    return result.data.publicUrl;
  } catch {
    return null;
  }
};

export const checkSlugExists = async (
  slug: string,
  excludeId?: string
): Promise<boolean> => {
  const result = await postNoteApi<boolean>({
    action: "checkSlugExists",
    slug,
    excludeId
  });

  return result === true;
};

export const updateNoteSlug = async (
  noteIdOrSlug: string,
  newSlug: string
): Promise<boolean> => {
  const result = await postNoteApi<boolean>({
    action: "updateNoteSlug",
    noteIdOrSlug,
    newSlug
  });

  return result === true;
};

export const updateNotePassword = async (
  noteIdOrSlug: string,
  password: string | null
): Promise<boolean> => {
  const result = await postNoteApi<boolean>({
    action: "updateNotePassword",
    noteIdOrSlug,
    password
  });

  return result === true;
};

export const checkExistAndProtected = async (
  noteIdOrSlug: string
): Promise<{ exists: boolean; isProtected: boolean }> => {
  const result = await postNoteApi<{ exists: boolean; isProtected: boolean }>({
    action: "checkExistAndProtected",
    noteIdOrSlug
  });

  return result ?? { exists: false, isProtected: false };
};

export const unlockNote = async (
  noteIdOrSlug: string,
  password: string
): Promise<Note | null> => {
  return postNoteApi<Note>({ action: "unlockNote", noteIdOrSlug, password });
};
