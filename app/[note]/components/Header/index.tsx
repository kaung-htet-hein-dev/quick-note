import ThemeToggle from "@/app/components/ThemeToggle";
import AutoSave from "../AutoSave";
import SaveButton from "../SaveButton";
import EditSlug from "../EditSlug";
import { useNoteEditorContext } from "../../hooks/useNoteContext";

const Header = () => {
  const { isAutoSaveEnabled } = useNoteEditorContext();

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 flex h-13.5 w-full flex-row items-center justify-between border-b border-border bg-surface px-4">
      <EditSlug />
      <div className="flex items-center gap-4">
        {!isAutoSaveEnabled && <SaveButton />}
        <AutoSave />
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Header;
