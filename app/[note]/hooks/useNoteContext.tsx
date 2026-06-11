import { useParams } from "next/navigation";
import { createContext, useContext, useMemo, useState } from "react";

type SaveNowHandler = (() => Promise<boolean>) | null;

type NoteEditorContextValue = {
  isAutoSaveEnabled: boolean;
  setIsAutoSaveEnabled: (enabled: boolean) => void;
  canSaveNow: boolean;
  isSaving: boolean;
  saveNow: () => Promise<boolean>;
  registerSaveNowHandler: (handler: () => Promise<boolean>) => void;
  noteID: string;
};

const NoteEditorContext = createContext<NoteEditorContextValue | null>(null);

type NoteEditorProviderProps = {
  children: React.ReactNode;
};

export function NoteEditorProvider({
  children
}: Readonly<NoteEditorProviderProps>) {
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
  const [saveNowHandler, setSaveNowHandler] = useState<SaveNowHandler>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { note } = useParams<{ note: string }>();

  const registerSaveNowHandler = (handler: () => Promise<boolean>) => {
    setSaveNowHandler(() => handler);
  };

  const saveNow = async (): Promise<boolean> => {
    if (!saveNowHandler || isSaving) {
      return false;
    }

    setIsSaving(true);
    try {
      return await saveNowHandler();
    } finally {
      setIsSaving(false);
    }
  };

  const value = useMemo<NoteEditorContextValue>(
    () => ({
      isAutoSaveEnabled,
      setIsAutoSaveEnabled,
      canSaveNow: !!saveNowHandler,
      isSaving,
      saveNow,
      registerSaveNowHandler,
      noteID: note
    }),
    [
      isAutoSaveEnabled,
      saveNowHandler,
      isSaving,
      saveNow,
      registerSaveNowHandler,
      note
    ]
  );

  return (
    <NoteEditorContext.Provider value={value}>
      {children}
    </NoteEditorContext.Provider>
  );
}

export function useNoteEditorContext() {
  const context = useContext(NoteEditorContext);
  if (!context) {
    throw new Error(
      "useNoteEditorContext must be used within NoteEditorProvider"
    );
  }
  return context;
}
