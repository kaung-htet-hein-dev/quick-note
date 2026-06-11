"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Markdown } from "@tiptap/markdown";
import { useState } from "react";

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

const Tiptap = () => {
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
        emptyEditorClass: "is-editor-empty"
      }),
      Markdown
    ],
    content: "",
    contentType: "markdown",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap-editor h-full w-full overflow-y-auto bg-bg px-5 py-4 text-body text-fg outline-none"
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
        const transfer = event.dataTransfer;
        const files = transfer ? Array.from(transfer.files) : [];
        const imageFiles = files.filter((file) =>
          file.type.startsWith("image/")
        );

        if (!editor || imageFiles.length === 0) {
          return false;
        }

        event.preventDefault();
        setIsDraggingImage(false);

        void (async () => {
          for (const file of imageFiles) {
            const src = await fileToDataUrl(file);
            editor
              .chain()
              .focus()
              .setImage({
                src,
                alt: file.name,
                title: file.name
              })
              .run();
          }
        })();

        return true;
      },
      handlePaste: (_view, event) => {
        const clipboard = event.clipboardData;
        const files = clipboard ? Array.from(clipboard.files) : [];
        const imageFiles = files.filter((file) =>
          file.type.startsWith("image/")
        );

        if (!editor || imageFiles.length === 0) {
          return false;
        }

        event.preventDefault();

        void (async () => {
          for (const file of imageFiles) {
            const src = await fileToDataUrl(file);
            editor
              .chain()
              .focus()
              .setImage({
                src,
                alt: file.name,
                title: file.name
              })
              .run();
          }
        })();

        return true;
      }
    }
  });

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col">
      <EditorContent editor={editor} className="h-full min-h-0 flex-1" />

      {isDraggingImage && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-xl border-2 border-dashed border-(--primary) bg-(--primary)/10 text-label text-fg">
          Drop image to insert
        </div>
      )}
    </div>
  );
};

export default Tiptap;
