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
  const [initialContent, setInitialContent] = useState("");
  const { noteID } = useNoteEditorContext();

  useEffect(() => {
    if (!noteID) return;

    const load = async () => {
      const loaded = await fetchOrCreateNote(noteID);
      setInitialContent(loaded?.content ?? "");
    };

    void load();
  }, [noteID]);

  return (
    <div className="flex h-screen flex-col overflow-hidden pt-13.5">
      <Header />
      <section className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 overflow-hidden p-4">
        <Tiptap initialContent={initialContent} />
      </section>
      <FloatingActionButtons />
    </div>
  );
};

export default NoteDetail;
