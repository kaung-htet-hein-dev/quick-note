"use client";

import Editor from "./components/Editor";
import Header from "./components/Header";
import FloatingActionButtons from "./components/FloatingActionButtons";

const NoteDetailPage = () => {
  return (
    <div className="min-h-screen pt-13.5">
      <Header />
      <section className="mx-auto w-full max-w-4xl p-4">
        <Editor />
      </section>
      <FloatingActionButtons />
    </div>
  );
};

export default NoteDetailPage;
