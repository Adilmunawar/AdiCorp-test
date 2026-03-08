
import GlobalSearch from "./GlobalSearch";
import NotificationDropdown from "./NotificationDropdown";

export default function Header({ title }: { title: string }) {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card sticky top-0 z-50">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <GlobalSearch />
        <NotificationDropdown />
      </div>
    </header>
  );
}
