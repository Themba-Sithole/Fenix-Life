import { useNavigate } from "react-router";
import {
  Building2,
  Briefcase,
  Car,
  GraduationCap,
  Heart,
  Home as HomeIcon,
  Map,
  Newspaper,
  Settings,
  Smartphone,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";

const NAV_ITEMS = [
  { label: "Smartphone", icon: Smartphone, path: "/phone" },
  { label: "City Map", icon: Map, path: "/city" },
  { label: "Banking", icon: Building2, path: "/banking" },
  { label: "Stocks", icon: TrendingUp, path: "/stocks" },
  { label: "Company", icon: Briefcase, path: "/company" },
  { label: "Employees", icon: Users, path: "/employees" },
  { label: "Real Estate", icon: HomeIcon, path: "/real-estate" },
  { label: "Vehicles", icon: Car, path: "/vehicles" },
  { label: "Education", icon: GraduationCap, path: "/education" },
  { label: "Family", icon: Heart, path: "/family" },
  { label: "Timeline", icon: Trophy, path: "/timeline" },
  { label: "News", icon: Newspaper, path: "/news" },
  { label: "Settings", icon: Settings, path: "/settings" },
] as const;

interface HomeNavSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HomeNavSheet({ open, onOpenChange }: HomeNavSheetProps) {
  const navigate = useNavigate();

  function goTo(path: string) {
    onOpenChange(false);
    navigate(path);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px]">
        <SheetHeader>
          <SheetTitle className="text-[#1C2541]">Navigate</SheetTitle>
        </SheetHeader>
        <div className="grid gap-2 mt-6">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.path}
              variant="outline"
              className="justify-start gap-3"
              onClick={() => goTo(item.path)}
            >
              <item.icon className="w-4 h-4 text-[#2EC4B6]" />
              {item.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
