import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, GraduationCap, Users, Briefcase } from "lucide-react";
import AvatarSelector from "../components/AvatarSelector";

export default function CharacterCreation() {
  const navigate = useNavigate();
  const [selectedBackground, setSelectedBackground] = useState("middle-class");
  const [selectedAvatar, setSelectedAvatar] = useState("professional");

  const backgrounds = [
    {
      id: "wealthy",
      name: "Wealthy Family",
      startingCash: "$500,000",
      education: "Private School",
      relationships: "Excellent",
      connections: "High Society",
      advantages: ["Trust Fund", "Business Contacts", "Premium Education"],
      disadvantages: ["High Expectations", "Pressure"],
      difficulty: "Easy",
      difficultyColor: "text-[#2EC4B6]",
    },
    {
      id: "middle-class",
      name: "Middle Class",
      startingCash: "$25,000",
      education: "Public School",
      relationships: "Good",
      connections: "Community",
      advantages: ["Stable Family", "Good Education", "Support Network"],
      disadvantages: ["Limited Capital", "Average Connections"],
      difficulty: "Normal",
      difficultyColor: "text-[#F4B400]",
    },
    {
      id: "working-class",
      name: "Working Class",
      startingCash: "$5,000",
      education: "Public School",
      relationships: "Strong",
      connections: "Local",
      advantages: ["Strong Work Ethic", "Resilience", "Street Smart"],
      disadvantages: ["Limited Resources", "Few Connections"],
      difficulty: "Hard",
      difficultyColor: "text-orange-400",
    },
    {
      id: "orphan",
      name: "Orphan",
      startingCash: "$500",
      education: "Basic",
      relationships: "None",
      connections: "None",
      advantages: ["Independence", "Determination", "Self-Reliant"],
      disadvantages: ["No Support", "No Resources", "Alone"],
      difficulty: "Very Hard",
      difficultyColor: "text-red-400",
    },
    {
      id: "immigrant",
      name: "Immigrant",
      startingCash: "$2,000",
      education: "Variable",
      relationships: "Family Abroad",
      connections: "Community",
      advantages: ["Multilingual", "Cultural Insight", "Hungry for Success"],
      disadvantages: ["Language Barrier", "Limited Local Network"],
      difficulty: "Hard",
      difficultyColor: "text-orange-400",
    },
    {
      id: "entrepreneur-family",
      name: "Entrepreneur Family",
      startingCash: "$100,000",
      education: "Business School",
      relationships: "Business Network",
      connections: "Industry Leaders",
      advantages: ["Business Knowledge", "Mentorship", "Startup Capital"],
      disadvantages: ["Following in Footsteps", "Comparison Pressure"],
      difficulty: "Normal",
      difficultyColor: "text-[#F4B400]",
    },
  ];

  const selectedBg = backgrounds.find(bg => bg.id === selectedBackground);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA] p-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>

        <Card className="border-[#2EC4B6]/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#1C2541] to-[#0B132B] text-white rounded-t-lg">
            <CardTitle className="text-3xl text-center">Create Your Character</CardTitle>
            <p className="text-center text-gray-300">Begin your journey to success</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Personal Details */}
              <div className="space-y-6">
                <h3 className="text-xl text-[#1C2541] mb-4">Personal Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter first name" className="border-[#2EC4B6]/30" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" className="border-[#2EC4B6]/30" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                      <SelectTrigger className="border-[#2EC4B6]/30">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input id="birthday" type="date" className="border-[#2EC4B6]/30" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select>
                    <SelectTrigger className="border-[#2EC4B6]/30">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                      <SelectItem value="germany">Germany</SelectItem>
                      <SelectItem value="japan">Japan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Starting City</Label>
                  <Select>
                    <SelectTrigger className="border-[#2EC4B6]/30">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nyc">New York City</SelectItem>
                      <SelectItem value="sf">San Francisco</SelectItem>
                      <SelectItem value="london">London</SelectItem>
                      <SelectItem value="tokyo">Tokyo</SelectItem>
                      <SelectItem value="singapore">Singapore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Appearance Options */}
                <div className="pt-4 border-t border-[#2EC4B6]/20">
                  <h4 className="mb-3 text-[#1C2541]">Appearance</h4>
                  
                  {/* Avatar Selection */}
                  <div className="mb-4">
                    <AvatarSelector 
                      selectedAvatar={selectedAvatar}
                      onSelect={setSelectedAvatar}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Select>
                      <SelectTrigger className="border-[#2EC4B6]/30">
                        <SelectValue placeholder="Skin Tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="border-[#2EC4B6]/30">
                        <SelectValue placeholder="Hairstyle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Right Column - Background Selection */}
              <div>
                <h3 className="text-xl text-[#1C2541] mb-4">Choose Your Background</h3>
                
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {backgrounds.map((bg) => (
                    <Card
                      key={bg.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedBackground === bg.id
                          ? 'border-[#2EC4B6] shadow-md shadow-[#2EC4B6]/20 bg-[#2EC4B6]/5'
                          : 'border-gray-200 hover:border-[#2EC4B6]/50'
                      }`}
                      onClick={() => setSelectedBackground(bg.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-[#1C2541]">{bg.name}</h4>
                          <Badge className={`${bg.difficultyColor} bg-transparent border`}>
                            {bg.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-[#2EC4B6]" />
                            <span className="text-gray-600">Cash:</span>
                            <span className="text-[#2EC4B6]">{bg.startingCash}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-[#F4B400]" />
                            <span className="text-gray-600">{bg.education}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-[#2EC4B6]" />
                            <span className="text-gray-600">{bg.relationships}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-[#F4B400]" />
                            <span className="text-gray-600">{bg.connections}</span>
                          </div>
                        </div>

                        {selectedBackground === bg.id && (
                          <div className="pt-3 border-t border-[#2EC4B6]/20">
                            <div className="mb-2">
                              <div className="text-xs text-gray-500 mb-1">Advantages:</div>
                              <div className="flex flex-wrap gap-1">
                                {bg.advantages.map((adv, i) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-[#2EC4B6]/10 text-[#2EC4B6] border-[#2EC4B6]/30">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {adv}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Disadvantages:</div>
                              <div className="flex flex-wrap gap-1">
                                {bg.disadvantages.map((dis, i) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
                                    <TrendingDown className="w-3 h-3 mr-1" />
                                    {dis}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-[#2EC4B6]/20">
              <Button variant="outline" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button
                onClick={() => navigate("/home")}
                className="bg-gradient-to-r from-[#2EC4B6] to-[#1C9B8F] hover:from-[#1C9B8F] hover:to-[#2EC4B6] text-white px-8"
              >
                Start Your Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}