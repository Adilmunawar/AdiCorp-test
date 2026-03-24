
import GlobalSearch from "./GlobalSearch";
import NotificationDropdown from "./NotificationDropdown";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function Header({ title, onMenuClick, showMenuButton = false }: HeaderProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        {showMenuButton && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onMenuClick}
            className="h-9 w-9 rounded-xl shrink-0"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-base md:text-lg font-semibold text-foreground truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <GlobalSearch />
        </div>
        <NotificationDropdown />
      </div>
    </header>
  );
}
