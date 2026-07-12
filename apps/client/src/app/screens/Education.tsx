import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  ArrowLeft,
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import {
  EDUCATION_PROGRAMS,
  educationCompleted,
  educationProgressPercent,
  effortLevelLabel,
  formatMoney,
  type EducationEffortLevel,
} from "@fenix/domain";

type EducationActionKind =
  | "EDUCATION_ENROLL"
  | "EDUCATION_SET_EFFORT"
  | "EDUCATION_STUDY_SESSION"
  | "EDUCATION_DROP_OUT"
  | "EDUCATION_PAY_TUITION";

export default function Education() {
  const navigate = useNavigate();
  const { world, applyAction } = useSimulation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [tuitionPayment, setTuitionPayment] = useState("500");

  const headerSubtitle = useMemo(() => {
    if (!world) return "Choose a program to begin your education journey";
    const edu = world.education;
    const isGraduated =
      educationCompleted(edu) || (!edu.enrolled && edu.credentials.length > 0);
    if (edu.enrolled) {
      return `${edu.programName} · ${edu.institution}`;
    }
    if (isGraduated) {
      return `${edu.credentials.length} credential${edu.credentials.length === 1 ? "" : "s"} earned`;
    }
    return "Choose a program to begin your education journey";
  }, [world]);

  const simulationGate = useSimulationGate("Loading education profile…");
  if (simulationGate) return simulationGate;
  if (!world) return null;

  const education = world.education;
  const currency = world.origin.currency;
  const programProgress = educationProgressPercent(education);
  const graduated = educationCompleted(education) || (!education.enrolled && education.credentials.length > 0);
  const notEnrolled = !education.enrolled && !graduated;

  const effortLevels: EducationEffortLevel[] = ["slacking", "normal", "grind"];

  async function handleEducationAction(
    kind: EducationActionKind,
    payload?: { programId?: string; effortLevel?: EducationEffortLevel; amountCents?: number },
  ) {
    setActionError(null);
    setBusyAction(kind);
    try {
      switch (kind) {
        case "EDUCATION_ENROLL":
          if (!payload?.programId) throw new Error("Select a program");
          await applyAction({ kind, programId: payload.programId });
          break;
        case "EDUCATION_SET_EFFORT":
          if (!payload?.effortLevel) throw new Error("Select an effort level");
          await applyAction({ kind, effortLevel: payload.effortLevel });
          break;
        case "EDUCATION_STUDY_SESSION":
          await applyAction({ kind });
          break;
        case "EDUCATION_DROP_OUT":
          await applyAction({ kind });
          break;
        case "EDUCATION_PAY_TUITION": {
          const amountCents = payload?.amountCents ?? Math.round(Number.parseFloat(tuitionPayment) * 100);
          if (!Number.isFinite(amountCents) || amountCents <= 0) {
            throw new Error("Enter a valid tuition payment");
          }
          await applyAction({ kind, amountCents });
          break;
        }
        default: {
          const _exhaustive: never = kind;
          return _exhaustive;
        }
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setBusyAction(null);
    }
  }

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
            <div>
              <h1 className="text-4xl text-white mb-2">Education</h1>
              <p className="text-gray-300">{headerSubtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {actionError ? (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{actionError}</p>
        ) : null}

        {education.tuitionDueCents > 0 ? (
          <Card className="mb-6 border-orange-200 bg-orange-50/50 shadow-lg">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <DollarSign className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1C2541]">Outstanding tuition</p>
                  <p className="text-lg text-orange-700">{formatMoney(education.tuitionDueCents, currency)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="number"
                  min="1"
                  step="100"
                  value={tuitionPayment}
                  onChange={(e) => setTuitionPayment(e.target.value)}
                  className="h-9 w-28 rounded-md border border-orange-200 px-2 text-sm"
                  aria-label="Tuition payment amount"
                />
                <Button
                  variant="outline"
                  disabled={busyAction !== null}
                  onClick={() => handleEducationAction("EDUCATION_PAY_TUITION")}
                >
                  Pay Tuition
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {notEnrolled ? (
          <Card className="border-[#2EC4B6]/20 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-[#1C2541] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#2EC4B6]" />
                Enroll in a Program
              </CardTitle>
              <p className="text-sm text-gray-600">
                GPA {education.gpa.toFixed(2)} · {education.credentials.length} credential
                {education.credentials.length === 1 ? "" : "s"} on record
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {EDUCATION_PROGRAMS.map((program) => (
                <div
                  key={program.id}
                  className="rounded-lg border border-[#2EC4B6]/20 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1">
                    <p className="text-[#1C2541] font-medium">{program.programName}</p>
                    <p className="text-sm text-gray-600">{program.institution}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{program.creditsRequired} credits</Badge>
                      <Badge variant="outline">
                        Tuition {formatMoney(program.tuitionCents, currency)}
                      </Badge>
                      <Badge variant="outline">Min GPA {program.minEnrollmentGpa.toFixed(1)}</Badge>
                    </div>
                  </div>
                  <Button
                    className="bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white shrink-0"
                    disabled={busyAction !== null}
                    onClick={() => handleEducationAction("EDUCATION_ENROLL", { programId: program.id })}
                  >
                    Enroll
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        {education.enrolled ? (
          <>
            <Card className="border-[#2EC4B6]/20 shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="text-[#1C2541] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#2EC4B6]" />
                  {education.programName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge variant="outline">{education.institution}</Badge>
                  <Badge variant="outline">GPA {education.gpa.toFixed(2)}</Badge>
                  <Badge variant="outline">Effort: {effortLevelLabel(education.effortLevel)}</Badge>
                  {education.probation ? (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Academic probation
                    </Badge>
                  ) : null}
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-gray-600">Credits</span>
                    <span className="text-[#1C2541]">
                      {education.creditsCompleted}/{education.creditsRequired} ({programProgress}%)
                    </span>
                  </div>
                  <Progress value={programProgress} className="h-2 bg-[#2EC4B6]" />
                </div>

                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-gray-500">Attendance</p>
                    <p className="text-[#1C2541] font-medium">{education.attendanceScore}%</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-gray-500">Study this week</p>
                    <p className="text-[#1C2541] font-medium">{education.studyHoursThisWeek}h</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-gray-500">Tuition due</p>
                    <p className="text-[#1C2541] font-medium">
                      {education.tuitionDueCents > 0
                        ? formatMoney(education.tuitionDueCents, currency)
                        : "Paid"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#F4B400]/20 shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="text-[#1C2541]">School Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Effort level</p>
                  <div className="flex flex-wrap gap-2">
                    {effortLevels.map((level) => (
                      <Button
                        key={level}
                        variant={education.effortLevel === level ? "default" : "outline"}
                        className={education.effortLevel === level ? "bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white" : ""}
                        disabled={busyAction !== null}
                        onClick={() => handleEducationAction("EDUCATION_SET_EFFORT", { effortLevel: level })}
                      >
                        {effortLevelLabel(level)}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white"
                    disabled={busyAction !== null}
                    onClick={() => handleEducationAction("EDUCATION_STUDY_SESSION")}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Study Session
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busyAction !== null}
                    onClick={() => handleEducationAction("EDUCATION_DROP_OUT")}
                  >
                    Drop Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}

        {graduated ? (
          <Card className="border-[#2EC4B6]/20 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-[#1C2541] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#F4B400]" />
                Graduated
              </CardTitle>
              <p className="text-sm text-gray-600">
                Program complete — credentials unlocked. Enroll again to pursue another degree.
              </p>
            </CardHeader>
          </Card>
        ) : null}

        <Card className="border-[#F4B400]/20 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-[#1C2541] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#F4B400]" />
              Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {education.credentials.length === 0 ? (
              <p className="text-sm text-gray-500">Complete a program to earn credentials.</p>
            ) : (
              education.credentials.map((credential) => (
                <div key={credential.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                  <div className="text-3xl">🎓</div>
                  <div className="flex-1">
                    <div className="text-[#1C2541]">{credential.name}</div>
                    <div className="text-sm text-gray-600">{credential.institution}</div>
                  </div>
                  <Badge variant="outline">GPA {credential.gpa.toFixed(2)}</Badge>
                  <Badge variant="outline">{credential.earnedDate}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-[#1C2541]/20 shadow-lg">
          <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <Briefcase className="w-8 h-8 text-[#F4B400] shrink-0" />
            <div className="flex-1">
              <div className="text-[#1C2541] font-medium">Career growth lives on the Career screen</div>
              <div className="text-sm text-gray-600">
                Raises, promotions, upskilling, and networking are managed separately from school.
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/career")}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Go to Career
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
