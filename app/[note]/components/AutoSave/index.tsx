import { useNoteEditorContext } from "../../hooks/useNoteContext";

const AutoSave = () => {
  const { isAutoSaveEnabled, setIsAutoSaveEnabled } = useNoteEditorContext();

  return (
    <div>
      <label
        className="flex cursor-pointer items-center gap-2 select-none"
        htmlFor="autosave-chk"
        title="Toggle auto-save"
      >
        <input
          type="checkbox"
          id="autosave-chk"
          className="peer sr-only"
          checked={isAutoSaveEnabled}
          onChange={(e) => setIsAutoSaveEnabled(e.target.checked)}
        />
        <span className="relative inline-block h-4.75 w-8.5 shrink-0 rounded-full border border-(--switch-off) bg-(--switch-off) transition peer-checked:border-(--success) peer-checked:bg-(--success) after:absolute after:left-0.5 after:top-0.5 after:h-3.25 after:w-3.25 after:rounded-full after:bg-(--foreground) after:transition peer-checked:after:translate-x-3.75"></span>
        <span className="text-label text-muted">Auto-Save</span>
      </label>
    </div>
  );
};

export default AutoSave;
