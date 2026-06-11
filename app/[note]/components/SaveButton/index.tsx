import { useNoteEditorContext } from "../../hooks/useNoteContext";

type SaveButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
};

const SaveButton = ({ disabled = false, onClick }: SaveButtonProps) => {
  const { saveNow, isSaving, canSaveNow } = useNoteEditorContext();

  const handleClick = async () => {
    if (onClick) {
      onClick();
      return;
    }

    await saveNow();
  };

  return (
    <button
      type="button"
      disabled={disabled || isSaving || !canSaveNow}
      onClick={handleClick}
      className="h-8 cursor-pointer rounded-md border border-(--primary) bg-(--primary) px-4 text-label text-(--primary-foreground) transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:border-(--switch-off) disabled:bg-(--switch-off) disabled:text-muted disabled:hover:brightness-100"
    >
      {isSaving ? "Saving..." : "Save"}
    </button>
  );
};

export default SaveButton;
