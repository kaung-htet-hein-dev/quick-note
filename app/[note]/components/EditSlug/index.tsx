import { useEffect, useRef, useState } from "react";

const EditSlug = () => {
  const [renameOpen, setRenameOpen] = useState(false);
  const slugInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!renameOpen) {
      return;
    }

    const input = slugInputRef.current;
    if (!input) {
      return;
    }

    input.focus();
    const textLength = input.value.length;
    input.setSelectionRange(textLength, textLength);
  }, [renameOpen]);

  const onSave = () => {
    setRenameOpen(false);
  };

  const onCancel = () => {
    setRenameOpen(false);
  };

  return (
    <div
      className="relative flex min-w-0 flex-1 items-center gap-1.5 overflow-visible"
      id="slug-zone"
    >
      {/* Slug display */}
      <span
        id="slug-display"
        title="note-slug"
        className="max-w-85 cursor-text truncate text-label text-fg font-['SF_Mono','Fira_Code','Cascadia_Code',ui-monospace,monospace]"
      >
        note-slug
      </span>

      {/* Rename trigger */}
      <button
        id="btn-rename"
        type="button"
        title="Rename slug"
        onClick={() => setRenameOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-label text-muted transition hover:border hover:border-border hover:bg-surface hover:text-fg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-3 w-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
          />
        </svg>
        Rename
      </button>

      {/* Rename popover */}
      {renameOpen && (
        <dialog
          id="rename-popover"
          open
          aria-label="Rename slug"
          className="absolute left-0 top-[calc(100%+10px)] z-100 flex w-75 flex-col gap-2.5 rounded-xl border border-border bg-surface p-4 shadow-[0_16px_40px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.1)] max-[540px]:fixed max-[540px]:left-3 max-[540px]:right-3 max-[540px]:top-13.5 max-[540px]:w-auto"
        >
          <p
            className="font-semibold tracking-wide text-fg"
            style={{ fontSize: 15 }}
          >
            Rename slug
          </p>

          <p
            className="-mt-0.5 text-muted"
            style={{ fontSize: 13, lineHeight: "1.6" }}
          >
            Make it unique — e.g.{" "}
            <code className="rounded bg-bg px-1 py-0.5 text-fg">
              yourname-topic
            </code>{" "}
            or{" "}
            <code className="rounded bg-bg px-1 py-0.5 text-fg">
              alex-work-log
            </code>
          </p>

          <input
            ref={slugInputRef}
            id="slug-input"
            type="text"
            spellCheck={false}
            autoComplete="off"
            placeholder="my-custom-slug"
            className="text-label w-full rounded-md border border-border bg-bg px-3 py-2 text-fg outline-none transition focus:border-(--primary) focus:ring-3 focus:ring-(--primary)/25 font-['SF_Mono','Fira_Code','Cascadia_Code',ui-monospace,monospace]"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSave();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                onCancel();
              }
            }}
          />

          <div className="flex items-start gap-2">
            {/* URL preview */}
            <div
              id="slug-preview"
              className="min-h-3.5 min-w-0 flex-1 break-all text-muted font-['SF_Mono','Fira_Code','Cascadia_Code',ui-monospace,monospace]"
              style={{ fontSize: 13 }}
              aria-live="polite"
            />
            <a
              className="text-indigo-300 hover:text-indigo-200 hover:underline cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
              href={"previewUrl"}
            >
              {"previewUrl"}
            </a>
            {/* Copy URL button */}
            <button
              id="btn-slug-copy"
              type="button"
              aria-label="Copy preview URL"
              title="Copy preview URL"
              className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-muted transition hover:border-(--primary) hover:text-(--primary) disabled:cursor-not-allowed disabled:opacity-45"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                />
              </svg>
            </button>
          </div>

          <div className="flex justify-end gap-1.5 mt-2">
            <button
              id="btn-slug-cancel"
              type="button"
              onClick={onCancel}
              className="inline-flex h-9 cursor-pointer items-center rounded-md border border-border px-3.5 text-label text-muted transition hover:bg-bg hover:text-fg"
            >
              Cancel
            </button>
            <button
              id="btn-slug-save"
              type="button"
              onClick={onSave}
              className="inline-flex h-9 cursor-pointer items-center rounded-md border border-(--primary) bg-(--primary) px-3.5 text-label text-(--primary-foreground) transition hover:brightness-110"
            >
              Save
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default EditSlug;
