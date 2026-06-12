"use client";

import { useState } from "react";
import { useNoteEditorContext } from "../../hooks/useNoteContext";
import { updateNotePassword } from "../../utils";
import LockIcon from "../LockIcon";
import PasswordModal from "../PasswordModal";

const FloatingActionButtons = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPasswordActionLoading, setIsPasswordActionLoading] = useState(false);
  const { noteID, isUnlocked, setIsUnlocked } = useNoteEditorContext();

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

    setIsPasswordActionLoading(true);
    try {
      const success = await updateNotePassword(noteID, password);

      if (!success) {
        alert("Failed to set password. Please try again.");
        return;
      }

      setIsUnlocked(true);
      setIsPasswordModalOpen(false);
    } finally {
      setIsPasswordActionLoading(false);
    }
  };

  const onUnlock = async () => {
    if (!noteID) {
      return;
    }

    setIsPasswordActionLoading(true);
    try {
      const success = await updateNotePassword(noteID, null);

      if (!success) {
        alert("Failed to remove password. Please try again.");
        return;
      }

      setIsUnlocked(false);
      setIsPasswordModalOpen(false);
    } finally {
      setIsPasswordActionLoading(false);
    }
  };

  const passwordAction = async () => {
    if (isPasswordActionLoading) {
      return;
    }

    if (isUnlocked) {
      await onUnlock();
    } else {
      onClickLock();
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-20 flex flex-col items-center gap-3">
        <button
          type="button"
          aria-label="Lock note"
          onClick={() => void passwordAction()}
          disabled={isPasswordActionLoading}
          className="flex h-13 w-13 items-center justify-center rounded-full border border-border bg-surface text-fg transition-all duration-200 hover:-translate-y-0.5"
        >
          <LockIcon isUnlocked={isUnlocked} isLoading={isPasswordActionLoading} />
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
        onAction={onConfirmLock}
        title={isUnlocked ? "Unlock Note" : "Lock Note"}
        body={
          isUnlocked
            ? "Type your password to unlock the note."
            : "Type your password to lock the note."
        }
        actionLabel={isUnlocked ? "Unlock" : "Lock"}
        isSubmitting={isPasswordActionLoading}
      />
    </>
  );
};

export default FloatingActionButtons;
