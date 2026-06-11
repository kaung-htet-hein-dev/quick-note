import { useEffect, useRef, useState } from "react";
import { useNoteEditorContext } from "../../hooks/useNoteContext";
import { checkSlugExists, isUuid, updateNoteSlug } from "../../utils";

const EditSlug = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const slugInputRef = useRef<HTMLInputElement>(null);
  const { noteID } = useNoteEditorContext();
  const [slugDraft, setSlugDraft] = useState(noteID);
  const [updatedSlug, setUpdatedSlug] = useState(noteID);

  useEffect(() => {
    if (!isEditing) return;

    const input = slugInputRef.current;
    if (!input) return;

    input.focus();
    input.select();
  }, [isEditing]);

  const onSave = async () => {
    const nextSlug = slugDraft.trim();

    if (!nextSlug || !noteID) {
      return;
    }

    if (nextSlug === noteID) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);

    try {
      const excludeId = isUuid(noteID) ? noteID : undefined;
      const slugTaken = await checkSlugExists(nextSlug, excludeId);

      if (slugTaken) {
        alert(
          `The slug "${nextSlug}" is already taken. Please choose a different one.`
        );
        return;
      }

      const success = await updateNoteSlug(noteID, nextSlug);

      if (success) {
        setIsEditing(false);
        if (globalThis.window) {
          globalThis.window.history.replaceState({}, "", `/${nextSlug}`);
          setUpdatedSlug(nextSlug);
          setSlugDraft(nextSlug);
        }
      } else {
        alert("Failed to update slug. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const onCancel = () => {
    setIsEditing(false);
    setSlugDraft(noteID);
  };

  return (
    <div
      className="relative flex min-w-0 flex-1 items-center gap-1.5 overflow-visible"
      id="slug-zone"
    >
      {isEditing ? (
        <div className="flex min-w-0 items-center gap-2">
          <input
            value={slugDraft}
            onChange={(e) => setSlugDraft(e.target.value)}
            ref={slugInputRef}
            id="slug-input"
            type="text"
            spellCheck={false}
            autoComplete="off"
            placeholder="my-custom-slug"
            disabled={isSaving}
            className="text-label w-72 max-w-full rounded-md border border-(--primary) bg-bg px-2.5 py-1 text-fg outline-none transition focus:ring-3 focus:ring-(--primary)/25 disabled:cursor-not-allowed disabled:opacity-45 font-['SF_Mono','Fira_Code','Cascadia_Code',ui-monospace,monospace]"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void onSave();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                onCancel();
              }
            }}
          />
          <button
            id="btn-slug-cancel"
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="inline-flex h-7 cursor-pointer items-center rounded-md border border-border px-2 text-label text-muted transition hover:bg-bg hover:text-fg disabled:cursor-not-allowed disabled:opacity-45"
          >
            {"Cancel"}
          </button>
          <button
            id="btn-slug-save"
            type="button"
            onClick={() => void onSave()}
            disabled={isSaving}
            className="inline-flex h-7 cursor-pointer items-center rounded-md border border-(--primary) bg-(--primary) px-2 text-label text-(--primary-foreground) transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      ) : (
        <button
          id="slug-display"
          type="button"
          title="Click to rename"
          onClick={() => setIsEditing(true)}
          className="inline-flex max-w-85 cursor-text items-center gap-1 rounded px-1 py-0.5 text-label text-fg transition hover:bg-bg font-['SF_Mono','Fira_Code','Cascadia_Code',ui-monospace,monospace]"
        >
          <span className="truncate">{updatedSlug}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4 shrink-0 opacity-70 ml-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default EditSlug;
