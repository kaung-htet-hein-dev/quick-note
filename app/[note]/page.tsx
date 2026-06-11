"use client";

import { useEffect, useState } from "react";
import FloatingActionButtons from "./components/FloatingActionButtons";
import Header from "./components/Header";
import Tiptap from "./components/Tiptap";
import {
  NoteEditorProvider,
  useNoteEditorContext
} from "./hooks/useNoteContext";
import { fetchOrCreateNote } from "./utils";

const NoteDetail = () => {
  return (
    <NoteEditorProvider>
      <NoteDetailPage />
    </NoteEditorProvider>
  );
};

const NoteDetailPage = () => {
  const [noteId, setNoteId] = useState<string | undefined>(undefined);
  const [initialContent, setInitialContent] = useState("");
  const { noteID } = useNoteEditorContext();

  useEffect(() => {
    if (!noteID) return;

    let cancelled = false;

    const load = async () => {
      const loaded = await fetchOrCreateNote(noteID);
      if (!cancelled) {
        setNoteId(loaded?.id);
        setInitialContent(loaded?.content ?? "");
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [noteID]);

  return (
    <div className="flex h-screen flex-col overflow-hidden pt-13.5">
      <Header />
      <section className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 overflow-hidden p-4">
        <Tiptap key={noteId} noteId={noteId} initialContent={initialContent} />
      </section>
      <FloatingActionButtons />
    </div>
  );
};

export default NoteDetail;
