import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Award, Building2, GraduationCap, Heart, TrendingUp, Users, DollarSign } from "lucide-react";

export default function Timeline() {
  const navigate = useNavigate();

  const events = [
    { year: 1994, age: 0, title: "Born", description: "Born in San Francisco, CA", icon: Users, color: "bg-pink-500" },
    { year: 2012, age: 18, title: "High School Graduation", description: "Graduated with honors", icon: GraduationCap, color: "bg-blue-500" },
    { year: 2016, age: 22, title: "College Graduation", description: "MBA from Stanford University", icon: GraduationCap, color: "bg-purple-500" },
    { year: 2017, age: 23, title: "First Job", description: "Junior Analyst at Tech Corp", icon: Building2, color: "bg-[#2EC4B6]" },
    { year: 2019, age: 25, title: "Founded TechVentures", description: "Started own company", icon: Building2, color: "bg-[#1C2541]" },
    { year: 2021, age: 27, title: "First Million", description: "Net worth reached $1M", icon: DollarSign, color: "bg-[#F4B400]" },
    { year: 2022, age: 28, title: "Met Emma", description: "Started relationship", icon: Heart, color: "bg-red-500" },
    { year: 2024, age: 30, title: "Series A Funding", description: "Raised $2M for company", icon: TrendingUp, color: "bg-[#2EC4B6]" },
    { year: 2025, age: 31, title: "Innovation Award", description: "Won Tech Innovation of the Year", icon: Award, color: "bg-[#F4B400]" },
    { year: 2026, age: 32, title: "Present Day", description: "CEO of TechVentures Inc.", icon: Building2, color: "bg-gradient-to-r from-[#2EC4B6] to-[#1C2541]" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl text-[#1C2541]">Life Timeline</h1>
            <p className="text-gray-600">Your Journey So Far</p>
          </div>
        </div>

        {/* Legacy Score */}
        <Card className="mb-8 border-[#2EC4B6]/20 shadow-xl bg-gradient-to-br from-[#1C2541] to-[#0B132B] text-white">
          <CardContent className="p-8 text-center">
            <div className="text-sm text-gray-300 mb-2">Legacy Score</div>
            <div className="text-6xl mb-4">8.7</div>
            <Badge className="bg-[#F4B400] text-white text-lg px-6 py-2">Exceptional</Badge>
            <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/10">
              <div>
                <div className="text-2xl text-[#2EC4B6]">10</div>
                <div className="text-sm text-gray-400">Major Achievements</div>
              </div>
              <div>
                <div className="text-2xl text-[#F4B400]">$2.4M</div>
                <div className="text-sm text-gray-400">Net Worth</div>
              </div>
              <div>
                <div className="text-2xl text-white">32</div>
                <div className="text-sm text-gray-400">Years Old</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="border-[#2EC4B6]/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#1C2541]">Life Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2EC4B6] to-[#1C2541]"></div>
              
              {/* Events */}
              <div className="space-y-8">
                {events.map((event, index) => (
                  <div key={index} className="relative flex items-start gap-6">
                    {/* Icon Circle */}
                    <div className={`${event.color} w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg z-10 flex-shrink-0`}>
                      <event.icon className="w-7 h-7" />
                    </div>
                    
                    {/* Event Card */}
                    <Card className="flex-1 border-gray-200 hover:border-[#2EC4B6] hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-lg text-[#1C2541]">{event.title}</h4>
                            <p className="text-sm text-gray-600">{event.description}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">{event.year}</Badge>
                            <div className="text-xs text-gray-500">Age {event.age}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
