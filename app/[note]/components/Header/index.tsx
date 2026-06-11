import ThemeToggle from "@/app/components/ThemeToggle";
import AutoSave from "../AutoSave";
import SaveButton from "../SaveButton";

const Header = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 flex h-13.5 w-full flex-row items-center justify-between border-b border-border bg-surface px-4">
      <div className="text-label font-semibold text-fg">Quick Note</div>
      <div className="flex items-center gap-4">
        <SaveButton />
        <AutoSave />
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Header;
