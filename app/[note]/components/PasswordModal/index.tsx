"use client";

import { useState } from "react";

type PasswordModalProps = {
  isOpen: boolean;
  onCancel?: () => void;
  onAction: (password: string) => void | Promise<void>;
  title: string;
  body: string;
  actionLabel?: string;
  isSubmitting?: boolean;
};

const PasswordModal = ({
  isOpen,
  onCancel,
  onAction,
  title,
  body,
  actionLabel = "Lock",
  isSubmitting = false
}: PasswordModalProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleCancel = () => {
    setPassword("");
    setShowPassword(false);
    onCancel?.();
  };

  const handleLock = async () => {
    await onAction(password);
    setPassword("");
    setShowPassword(false);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-5 shadow-lg">
        <h2 className="text-title text-fg">{title}</h2>
        <p className="mt-1 text-label text-muted">{body}</p>

        <div className="mt-4 relative">
          <input
            autoFocus
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            disabled={isSubmitting}
            onKeyDown={(event) => {
              if (isSubmitting) {
                return;
              }

              if (event.key === "Enter") {
                event.preventDefault();
                void handleLock();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                handleCancel();
              }
            }}
            className="text-label w-full rounded-md border border-border bg-bg px-3 py-2 pr-10 text-fg outline-none transition focus:border-(--primary) focus:ring-3 focus:ring-(--primary)/25"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isSubmitting}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-fg disabled:cursor-not-allowed disabled:opacity-45"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.5a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="inline-flex h-9 items-center rounded-md border border-border px-3 text-label text-muted transition hover:bg-bg hover:text-fg disabled:cursor-not-allowed disabled:opacity-45"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={() => void handleLock()}
            disabled={!password.trim() || isSubmitting}
            className="inline-flex h-9 items-center rounded-md border border-(--primary) bg-(--primary) px-3 text-label text-(--primary-foreground) transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isSubmitting ? "Loading..." : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
