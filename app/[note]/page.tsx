"use client";

import Tiptap from "./components/Tiptap";
import Header from "./components/Header";
import FloatingActionButtons from "./components/FloatingActionButtons";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchOrCreateNote } from "./utils";
import { NoteEditorProvider } from "./hooks/useNoteContext";

const NoteDetail = () => {
  return (
    <NoteEditorProvider>
      <NoteDetailPage />
    </NoteEditorProvider>
  );
};

const NoteDetailPage = () => {
  const { note } = useParams<{ note: string }>();
  const [noteId, setNoteId] = useState<string | undefined>(undefined);
  const [initialContent, setInitialContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!note) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const loaded = await fetchOrCreateNote(note);
      if (!cancelled) {
        setNoteId(loaded?.id);
        setInitialContent(loaded?.content ?? "");
        setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [note]);

  return (
    <div className="flex h-screen flex-col overflow-hidden pt-13.5">
      <Header />
      <section className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 overflow-hidden p-4">
        {loading ? (
          <div className="flex-1 animate-pulse rounded-lg bg-surface" />
        ) : (
          <Tiptap
            key={noteId}
            noteId={noteId}
            initialContent={initialContent}
          />
        )}
      </section>
      <FloatingActionButtons />
    </div>
  );
};

export default NoteDetail;
