import { Label } from "./ui/label";
import { User, UserCircle2, Smile, Brain, Trophy, Briefcase, GraduationCap, Crown, Heart, Zap, Star, Target } from "lucide-react";

interface AvatarOption {
  id: string;
  icon: React.ElementType;
  tone: string;
  label: string;
  theme: string;
}

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatarId: string) => void;
}

export default function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
  const avatars: AvatarOption[] = [
    { id: "professional", icon: Briefcase, tone: "bg-fenix-navy text-white", label: "Professional", theme: "Business" },
    { id: "scholar", icon: GraduationCap, tone: "bg-fenix-gold text-fenix-navy", label: "Scholar", theme: "Academic" },
    { id: "innovator", icon: Brain, tone: "bg-fenix-emerald text-fenix-navy", label: "Innovator", theme: "Tech" },
    { id: "leader", icon: Crown, tone: "bg-fenix-navy text-fenix-gold", label: "Leader", theme: "Executive" },
    { id: "achiever", icon: Trophy, tone: "bg-fenix-emerald text-fenix-navy", label: "Achiever", theme: "Success" },
    { id: "strategist", icon: Target, tone: "bg-fenix-blue text-white", label: "Strategist", theme: "Tactical" },
    { id: "creative", icon: Star, tone: "bg-fenix-gold text-fenix-navy", label: "Creative", theme: "Artistic" },
    { id: "energetic", icon: Zap, tone: "bg-fenix-emerald text-fenix-navy", label: "Energetic", theme: "Dynamic" },
    { id: "charismatic", icon: Heart, tone: "bg-fenix-blue text-white", label: "Charismatic", theme: "Social" },
    { id: "visionary", icon: UserCircle2, tone: "bg-fenix-navy text-fenix-emerald", label: "Visionary", theme: "Future" },
    { id: "friendly", icon: Smile, tone: "bg-fenix-emerald text-fenix-navy", label: "Friendly", theme: "Approachable" },
    { id: "classic", icon: User, tone: "bg-fenix-blue text-white", label: "Classic", theme: "Traditional" },
  ];

  return (
    <div className="space-y-3">
      <Label className="text-foreground">Choose your avatar</Label>
      <div className="grid grid-cols-4 gap-3">
        {avatars.map((avatar) => {
          const Icon = avatar.icon;
          const isSelected = selectedAvatar === avatar.id;
          
          return (
            <button
              key={avatar.id}
              type="button"
              aria-pressed={isSelected}
              className={`rounded-lg border p-3 transition-colors ${
                isSelected
                  ? 'border-fenix-emerald bg-fenix-emerald/10 ring-2 ring-fenix-emerald/25'
                  : 'border-border bg-surface-1 hover:border-fenix-emerald/50'
              }`}
              onClick={() => onSelect(avatar.id)}
            >
              <span className="flex flex-col items-center">
                <span className={`mb-2 flex h-14 w-14 items-center justify-center rounded-full ${avatar.tone} ${
                  isSelected ? 'scale-110 shadow-lg' : ''
                } transition-transform`}>
                  <Icon className="h-7 w-7" />
                </span>
                <span className="text-center text-xs text-foreground">{avatar.label}</span>
                <span className="mt-1 text-[10px] text-muted-foreground">{avatar.theme}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
