"use client";

import { useState } from "react";
import { useNoteEditorContext } from "../../hooks/useNoteContext";
import { updateNotePassword } from "../../utils";
import PasswordModal from "../PasswordModal";

const FloatingActionButtons = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { noteID } = useNoteEditorContext();

  const onClickNew = () => {
    if (!globalThis.window) return;

    globalThis.window.open(
      globalThis.window.location.origin,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const onClickLock = () => {
    setIsPasswordModalOpen(true);
  };

  const onCancelLock = () => {
    setIsPasswordModalOpen(false);
  };

  const onConfirmLock = async (password: string) => {
    if (!noteID || !password.trim()) {
      return;
    }

    const success = await updateNotePassword(noteID, password);

    if (!success) {
      alert("Failed to set password. Please try again.");
      return;
    }

    setIsPasswordModalOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-20 flex flex-col items-center gap-3">
        <button
          type="button"
          aria-label="Lock note"
          onClick={onClickLock}
          className="flex h-13 w-13 items-center justify-center rounded-full border border-border bg-surface text-fg transition-all duration-200 hover:-translate-y-0.5"
        >
          {true ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          )}
        </button>

        <button
          type="button"
          aria-label="Create sub note"
          onClick={onClickNew}
          className="flex h-13 w-13 items-center justify-center rounded-full border border-border bg-surface text-fg transition-all duration-200 hover:-translate-y-0.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onCancel={onCancelLock}
        onLock={onConfirmLock}
      />
    </>
  );
};

export default FloatingActionButtons;
