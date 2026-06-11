"use client";

import Tiptap from "./components/Tiptap";
import Header from "./components/Header";
import FloatingActionButtons from "./components/FloatingActionButtons";

const NoteDetailPage = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden pt-13.5">
      <Header />
      <section className="mx-auto flex w-full max-w-4xl flex-1 p-4">
        <Tiptap />
      </section>
      <FloatingActionButtons />
    </div>
  );
};

export default NoteDetailPage;
