"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Markdown } from "@tiptap/markdown";
import type { Content } from "@tiptap/core";
import { useEffect, useRef, useState } from "react";
import { uploadNoteImage, saveNote } from "../../utils";
import { useNoteEditorContext } from "../../hooks/useNoteContext";

type TiptapProps = {
  initialContent?: string;
};

type ParsedEditorContent = {
  content: Content;
  contentType?: "markdown";
};

const parseStoredContent = (value: string): ParsedEditorContent => {
  if (!value.trim()) {
    return { content: "", contentType: "markdown" };
  }

  try {
    const parsed = JSON.parse(value);
    if (
      parsed &&
      typeof parsed === "object" &&
      "type" in parsed &&
      (parsed as { type?: string }).type === "doc"
    ) {
      return { content: parsed };
    }
  } catch {
    // Fall back to markdown for legacy plain-text content.
  }

  return { content: value, contentType: "markdown" };
};

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to read image file"));
        return;
      }
      resolve(result);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read image file"));
    };

    reader.readAsDataURL(file);
  });
};

const insertImageFiles = async (
  files: File[],
  noteID: string | undefined,
  insert: (src: string, name: string) => void
) => {
  for (const file of files) {
    let src: string | null = noteID
      ? await uploadNoteImage(file, noteID)
      : null;

    if (!src) {
      src = await fileToDataUrl(file);
    }

    insert(src, file.name);
  }
};

const Tiptap = ({ initialContent = "" }: TiptapProps) => {
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const parsedInitialContent = parseStoredContent(initialContent);
  const { isAutoSaveEnabled, registerSaveNowHandler, noteID } =
    useNoteEditorContext();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: false, inline: false }),
      Placeholder.configure({
        placeholder: "Start writing...",
        emptyEditorClass: "is-editor-empty"
      }),
      Markdown
    ],
    content: parsedInitialContent.content,
    contentType: parsedInitialContent.contentType,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (!isAutoSaveEnabled || !noteID) return;

      if (saveTimer.current) clearTimeout(saveTimer.current);

      saveTimer.current = setTimeout(() => {
        const editorJson = editor.getJSON();
        void saveNote(noteID, JSON.stringify(editorJson));
      }, 1000);
    },
    editorProps: {
      attributes: {
        class:
          "tiptap-editor min-h-full w-full bg-bg px-5 py-4 text-body text-fg outline-none"
      },
      handleDOMEvents: {
        dragenter: (_view, event) => {
          if (event.dataTransfer?.types.includes("Files")) {
            setIsDraggingImage(true);
          }
          return false;
        },
        dragover: (_view, event) => {
          if (event.dataTransfer?.types.includes("Files")) {
            event.preventDefault();
            setIsDraggingImage(true);
          }
          return false;
        },
        dragleave: (_view, event) => {
          const nextTarget = event.relatedTarget as Node | null;
          if (
            !event.currentTarget ||
            !(event.currentTarget as Node).contains(nextTarget)
          ) {
            setIsDraggingImage(false);
          }
          return false;
        }
      },
      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) =>
          f.type.startsWith("image/")
        );

        if (!editor || files.length === 0) return false;

        event.preventDefault();
        setIsDraggingImage(false);

        void insertImageFiles(files, noteID, (src, name) => {
          editor
            .chain()
            .focus()
            .setImage({ src, alt: name, title: name })
            .run();
        });

        return true;
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) =>
          f.type.startsWith("image/")
        );

        if (!editor || files.length === 0) return false;

        event.preventDefault();

        void insertImageFiles(files, noteID, (src, name) => {
          editor
            .chain()
            .focus()
            .setImage({ src, alt: name, title: name })
            .run();
        });

        return true;
      }
    }
  });

  useEffect(() => {
    const saveCurrentEditorContent = async () => {
      if (!editor || !noteID) {
        return false;
      }

      const editorJson = editor.getJSON();
      return saveNote(noteID, JSON.stringify(editorJson));
    };

    registerSaveNowHandler(saveCurrentEditorContent);
  }, [editor, noteID]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col">
      <EditorContent
        editor={editor}
        className="h-full min-h-0 flex-1 overflow-y-auto"
      />

      {isDraggingImage && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-xl border-2 border-dashed border-(--primary) bg-(--primary)/10 text-label text-fg">
          Drop image to insert
        </div>
      )}
    </div>
  );
};

export default Tiptap;
