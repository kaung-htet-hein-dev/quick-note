"use client";

import { useEffect, useState } from "react";
import FloatingActionButtons from "./components/FloatingActionButtons";
import Header from "./components/Header";
import Tiptap from "./components/Tiptap";
import {
  NoteEditorProvider,
  useNoteEditorContext
} from "./hooks/useNoteContext";
import { checkExistAndProtected, fetchOrCreateNote, unlockNote } from "./utils";
import PasswordModal from "./components/PasswordModal";

const NoteDetail = () => {
  return (
    <NoteEditorProvider>
      <NoteDetailPage />
    </NoteEditorProvider>
  );
};

const NoteDetailPage = () => {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [initialContent, setInitialContent] = useState("");
  const { noteID, setIsUnlocked } = useNoteEditorContext();

  useEffect(() => {
    if (!noteID) return;

    const load = async () => {
      const isExistAndProtected = await checkExistAndProtected(noteID);

      if (isExistAndProtected.isProtected) {
        setPasswordModalOpen(true);
        return;
      }

      const loaded = await fetchOrCreateNote(noteID);
      setInitialContent(loaded?.content ?? "");
    };

    void load();
  }, [noteID]);

  const onUnlock = async (password: string) => {
    if (!noteID || !password.trim()) {
      return;
    }

    const loaded = await unlockNote(noteID, password);

    if (!loaded) {
      alert("Incorrect password. Please try again.");
      return;
    }

    setInitialContent(loaded.content);
    setIsUnlocked(true);
    setPasswordModalOpen(false);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden pt-13.5">
      <Header />
      <section className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 overflow-hidden p-4">
        <Tiptap key={initialContent} initialContent={initialContent} />
      </section>
      <FloatingActionButtons />
      <PasswordModal
        isOpen={passwordModalOpen}
        title={"Unlock Note"}
        body={"Type your password to unlock the note."}
        onAction={onUnlock}
        actionLabel={"Submit"}
      />
    </div>
  );
};

export default NoteDetail;
