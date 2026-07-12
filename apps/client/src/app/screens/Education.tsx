import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, GraduationCap, Award, BookOpen, Briefcase, TrendingUp, Users } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import {
  computeFiveCapitals,
  educationProgressPercent,
  employmentStatusLabel,
  formatMoney,
} from "@fenix/domain";

export default function Education() {
  const navigate = useNavigate();
  const { world, isLoading, applyAction } = useSimulation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  async function handleCareerAction(
    kind: "CAREER_REQUEST_RAISE" | "CAREER_UPSKILL" | "CAREER_NETWORK",
  ) {
    setActionError(null);
    setBusyAction(kind);
    try {
      await applyAction({ kind });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setBusyAction(null);
    }
  }

  const simulationGate = useSimulationGate("Loading education profile…");
  if (simulationGate) return simulationGate;
  if (!world) return null;

  const traits = world.player.traits;
  const education = world.education;
  const programProgress = educationProgressPercent(education);
  const capitals = computeFiveCapitals({
    player: world.player,
    banking: world.banking,
    company: world.company,
    career: world.career,
    tickCount: world.clock.tickCount,
    currency: world.origin.currency,
  });

  const skills = [
    { name: "Conscientiousness (CDPS)", value: traits.conscientiousness },
    { name: "Openness (CDPS)", value: traits.openness },
    { name: "Health & stamina", value: traits.health },
    { name: "Career performance", value: world.career.performanceScore },
  ];

  const certificates = [
    {
      name: education.enrolled ? education.programName : "Program Complete",
      institution: education.institution,
      year: new Date(world.currentDate).getFullYear(),
      emoji: "🎓",
    },
    {
      name: employmentStatusLabel(world.career.status),
      institution: world.career.employerName,
      year: world.player.ageYears,
      emoji: "💼",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
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
                <h1 className="text-4xl text-white mb-2">Education & Human Capital</h1>
                <p className="text-gray-300">{world.career.jobTitle} · {world.career.employerName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Human Capital</p>
                <p className="text-3xl text-[#2EC4B6]">{capitals.human}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {actionError ? (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{actionError}</p>
        ) : null}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2EC4B6]" />
                Skills & Traits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{skill.name}</span>
                    <span className="text-sm text-[#1C2541]">{skill.value}%</span>
                  </div>
                  <Progress value={skill.value} className="h-2 bg-[#2EC4B6]" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-[#F4B400]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#F4B400]" />
                Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert.name} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                  <div className="text-3xl">{cert.emoji}</div>
                  <div className="flex-1">
                    <div className="text-[#1C2541]">{cert.name}</div>
                    <div className="text-sm text-gray-600">{cert.institution}</div>
                  </div>
                  <Badge variant="outline">{cert.year}</Badge>
                </div>
              ))}
              <div className="p-4 rounded-lg bg-[#2EC4B6]/10 flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-[#2EC4B6] mt-0.5" />
                <div>
                  <div className="text-sm text-[#1C2541] font-medium">Career experience</div>
                  <div className="text-sm text-gray-600">{world.career.yearsExperience} years · Performance {world.career.performanceScore}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 border-[#2EC4B6]/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#1C2541] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#2EC4B6]" />
              {education.programName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{education.institution}</span>
              <Badge variant="outline">GPA {education.gpa.toFixed(2)}</Badge>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-600">Program progress</span>
                <span className="text-[#1C2541]">
                  {education.creditsCompleted}/{education.creditsRequired} credits ({programProgress}%)
                </span>
              </div>
              <Progress value={programProgress} className="h-2 bg-[#2EC4B6]" />
            </div>
            <p className="text-sm text-gray-600">
              {education.enrolled
                ? "Credits advance automatically while enrolled and time progresses."
                : "Program complete — credentials unlocked."}
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 border-[#F4B400]/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#1C2541] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#F4B400]" />
              Career Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span>{world.career.jobTitle} at {world.career.employerName}</span>
              <Badge variant="outline">{employmentStatusLabel(world.career.status)}</Badge>
              <Badge variant="outline">Performance {world.career.performanceScore}%</Badge>
              <Badge variant="outline">{formatMoney(world.career.monthlySalaryCents, world.origin.currency)}/mo</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              {world.career.status === "unemployed" ? (
                <Button
                  className="bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white"
                  onClick={() => navigate("/career")}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Browse job listings
                </Button>
              ) : (
                <>
                  <Button
                    className="bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white"
                    disabled={busyAction !== null}
                    onClick={() => handleCareerAction("CAREER_REQUEST_RAISE")}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Request Raise
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busyAction !== null}
                    onClick={() => handleCareerAction("CAREER_UPSKILL")}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Upskill ($300)
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busyAction !== null}
                    onClick={() => handleCareerAction("CAREER_NETWORK")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Network ($150)
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 border-[#2EC4B6]/20 shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <GraduationCap className="w-8 h-8 text-[#2EC4B6]" />
            <div>
              <div className="text-[#1C2541] font-medium">Human capital grows with time, health, and career performance</div>
              <div className="text-sm text-gray-600">Advance your life on Home to improve skills and unlock new opportunities.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
