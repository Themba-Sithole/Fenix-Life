import { useNavigate } from "react-router";
import { MORE_ITEMS } from "./shell/LifeDock";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { cn } from "./ui/utils";

interface HomeNavSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** @deprecated Prefer LifeDock “More” sheet — kept as thin alias for existing callers. */
export function HomeNavSheet({ open, onOpenChange }: HomeNavSheetProps) {
  const navigate = useNavigate();

  function goTo(path: string) {
    onOpenChange(false);
    navigate(path);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[70vh]">
        <SheetHeader>
          <SheetTitle className="font-display text-foreground">More</SheetTitle>
        </SheetHeader>
        <ul className="mt-4 grid gap-1 pb-6">
          {MORE_ITEMS.map((item) => (
            <li key={item.path}>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm text-foreground hover:bg-muted",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
                )}
                onClick={() => goTo(item.path)}
              >
                <item.icon className="h-4 w-4 text-secondary" aria-hidden />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
