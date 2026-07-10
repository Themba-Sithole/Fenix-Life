import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { User, UserCircle2, Smile, Brain, Trophy, Briefcase, GraduationCap, Crown, Heart, Zap, Star, Target } from "lucide-react";
import { Badge } from "./ui/badge";

interface AvatarOption {
  id: string;
  icon: React.ElementType;
  gradient: string;
  label: string;
  theme: string;
}

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatarId: string) => void;
}

export default function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
  const avatars: AvatarOption[] = [
    { id: "professional", icon: Briefcase, gradient: "from-[#2EC4B6] to-[#1C9B8F]", label: "Professional", theme: "Business" },
    { id: "scholar", icon: GraduationCap, gradient: "from-[#F4B400] to-[#E69500]", label: "Scholar", theme: "Academic" },
    { id: "innovator", icon: Brain, gradient: "from-[#8B5CF6] to-[#6D28D9]", label: "Innovator", theme: "Tech" },
    { id: "leader", icon: Crown, gradient: "from-[#EF4444] to-[#DC2626]", label: "Leader", theme: "Executive" },
    { id: "achiever", icon: Trophy, gradient: "from-[#10B981] to-[#059669]", label: "Achiever", theme: "Success" },
    { id: "strategist", icon: Target, gradient: "from-[#3B82F6] to-[#2563EB]", label: "Strategist", theme: "Tactical" },
    { id: "creative", icon: Star, gradient: "from-[#EC4899] to-[#DB2777]", label: "Creative", theme: "Artistic" },
    { id: "energetic", icon: Zap, gradient: "from-[#F59E0B] to-[#D97706]", label: "Energetic", theme: "Dynamic" },
    { id: "charismatic", icon: Heart, gradient: "from-[#F97316] to-[#EA580C]", label: "Charismatic", theme: "Social" },
    { id: "visionary", icon: UserCircle2, gradient: "from-[#06B6D4] to-[#0891B2]", label: "Visionary", theme: "Future" },
    { id: "friendly", icon: Smile, gradient: "from-[#14B8A6] to-[#0D9488]", label: "Friendly", theme: "Approachable" },
    { id: "classic", icon: User, gradient: "from-[#1C2541] to-[#0B132B]", label: "Classic", theme: "Traditional" },
  ];

  return (
    <div className="space-y-3">
      <Label className="text-[#1C2541]">Choose Your Avatar</Label>
      <div className="grid grid-cols-4 gap-3">
        {avatars.map((avatar) => {
          const Icon = avatar.icon;
          const isSelected = selectedAvatar === avatar.id;
          
          return (
            <Card
              key={avatar.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? 'border-[#2EC4B6] border-2 shadow-md shadow-[#2EC4B6]/20 ring-2 ring-[#2EC4B6]/30'
                  : 'border-gray-200 hover:border-[#2EC4B6]/50'
              }`}
              onClick={() => onSelect(avatar.id)}
            >
              <CardContent className="p-3 flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center mb-2 ${
                  isSelected ? 'scale-110 shadow-lg' : ''
                } transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-xs text-center text-[#1C2541] mb-1">{avatar.label}</p>
                <Badge variant="outline" className="text-[10px] px-1 py-0 bg-gray-50 text-gray-600 border-gray-300">
                  {avatar.theme}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
