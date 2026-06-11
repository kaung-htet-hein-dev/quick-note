type SaveButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
};

const SaveButton = ({ disabled = false, onClick }: SaveButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="h-8 cursor-pointer rounded-md border border-(--primary) bg-(--primary) px-4 text-label text-(--primary-foreground) transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:border-(--switch-off) disabled:bg-(--switch-off) disabled:text-muted disabled:hover:brightness-100"
    >
      Save
    </button>
  );
};

export default SaveButton;
