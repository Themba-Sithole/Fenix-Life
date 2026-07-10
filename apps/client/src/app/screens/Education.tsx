import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, GraduationCap, Award, BookOpen } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Education() {
  const navigate = useNavigate();

  const courses = [
    { name: "Advanced Business Strategy", grade: 92, progress: 75, credits: 3 },
    { name: "Financial Management", grade: 88, progress: 100, credits: 3 },
    { name: "Marketing Analytics", grade: 95, progress: 60, credits: 3 },
    { name: "Leadership & Ethics", grade: 90, progress: 80, credits: 2 },
  ];

  const certificates = [
    { name: "MBA", institution: "Stanford University", year: 2016, emoji: "🎓" },
    { name: "Project Management", institution: "PMI", year: 2019, emoji: "📊" },
    { name: "Data Science", institution: "MIT", year: 2021, emoji: "📈" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      {/* Hero Header with Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1731349219592-60ca16964631?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzgzNjk2OTU3fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="University campus"
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
                <h1 className="text-4xl text-white mb-2">Education</h1>
                <p className="text-gray-300">Stanford Business School</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">GPA</p>
                <p className="text-3xl text-[#2EC4B6]">3.85</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Courses */}
          <Card className="border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2EC4B6]" />
                Current Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.map((course) => (
                <div key={course.name} className="p-4 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-[#1C2541]">{course.name}</h4>
                    <Badge className="bg-[#2EC4B6] text-white">Grade: {course.grade}</Badge>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-600">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2 bg-[#2EC4B6]" />
                  </div>
                  <div className="text-sm text-gray-600">{course.credits} Credits</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Certificates */}
          <Card className="border-[#F4B400]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#F4B400]" />
                Certificates & Degrees
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert.name} className="p-4 rounded-lg bg-gradient-to-r from-[#F4B400]/10 to-transparent">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{cert.emoji}</div>
                    <div className="flex-1">
                      <h4 className="text-[#1C2541] mb-1">{cert.name}</h4>
                      <p className="text-sm text-gray-600">{cert.institution}</p>
                      <p className="text-sm text-gray-500">Year: {cert.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Student Info */}
          <Card className="md:col-span-2 border-[#2EC4B6]/20 shadow-lg bg-gradient-to-br from-[#1C2541] to-[#0B132B] text-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="text-sm text-gray-300 mb-2">GPA</div>
                  <div className="text-4xl text-[#2EC4B6]">3.9</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300 mb-2">Credits Earned</div>
                  <div className="text-4xl">48</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300 mb-2">Student Loans</div>
                  <div className="text-4xl text-[#F4B400]">$0</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300 mb-2">Graduation</div>
                  <div className="text-2xl">Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}