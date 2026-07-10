import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Heart, Users, Gift, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Family() {
  const navigate = useNavigate();

  const familyMembers = [
    { name: "Emma Chen", relationship: "Partner", age: 30, happiness: 95, emoji: "👩", initials: "EC" },
    { name: "Michael Chen", relationship: "Father", age: 62, happiness: 88, emoji: "👨", initials: "MC" },
    { name: "Lisa Chen", relationship: "Mother", age: 59, happiness: 90, emoji: "👩", initials: "LC" },
    { name: "Sophie Chen", relationship: "Sister", age: 28, happiness: 85, emoji: "👧", initials: "SC" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      {/* Hero Header with Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1603367563698-67012943fd67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3ODM3MDY3ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Happy family"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B132B]/80 to-[#1C2541]/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/home")}
              className="text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl text-white mb-2">Family</h1>
                <p className="text-gray-300">The Chen Family</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Family Overview */}
        <Card className="mb-6 border-[#2EC4B6]/20 shadow-lg bg-gradient-to-br from-[#1C2541] to-[#0B132B] text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-sm text-gray-300 mb-2">Family Members</div>
                <div className="text-4xl text-[#2EC4B6]">4</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Family Happiness</div>
                <div className="text-4xl text-[#F4B400]">90%</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Household Expenses</div>
                <div className="text-4xl">$6,500</div>
                <div className="text-sm text-gray-400">/month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Family Members */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {familyMembers.map((member) => (
            <Card key={member.name} className="border-[#2EC4B6]/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-[#2EC4B6]">
                    <AvatarFallback className="bg-gradient-to-br from-[#2EC4B6] to-[#1C2541] text-white text-xl">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl text-[#1C2541]">{member.name}</h3>
                    <p className="text-gray-600">{member.relationship}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">Age {member.age}</Badge>
                      <Badge className="bg-[#2EC4B6]/20 text-[#2EC4B6] border-[#2EC4B6]/30 text-xs">
                        <Heart className="w-3 h-3 mr-1" />
                        {member.happiness}% Happy
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Gift className="w-4 h-4 mr-1" />
                    Send Gift
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    Plan Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Events */}
        <Card className="border-[#F4B400]/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#1C2541]">Upcoming Family Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-[#2EC4B6]/10">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[#1C2541]">Emma's Birthday</div>
                    <div className="text-sm text-gray-600">July 25, 2026</div>
                  </div>
                  <Badge className="bg-[#F4B400] text-white">In 15 days</Badge>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[#1C2541]">Family Dinner</div>
                    <div className="text-sm text-gray-600">July 15, 2026</div>
                  </div>
                  <Badge variant="outline">In 5 days</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}