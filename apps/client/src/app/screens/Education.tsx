import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
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
import { DecisionPanel, EmptyState, LifeShell } from "../components/shell";

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
    <LifeShell
      playerName={world.player.displayName}
      ageYears={world.player.ageYears}
      statusLine={education.enrolled ? education.programName : "School and credentials"}
    >
      <header className="mb-6">
        <p className="text-sm text-muted-foreground">Learning</p>
        <h1 className="font-display text-3xl tracking-tight text-foreground">Education</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          School progress shapes the roles you can pursue.
        </p>
      </header>
        {actionError ? (
          <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{actionError}</p>
        ) : null}

        {education.tuitionDueCents > 0 ? (
          <DecisionPanel title="Outstanding tuition" description={`Due: ${formatMoney(education.tuitionDueCents, currency)}`} className="mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3 flex-1">
                <DollarSign className="mt-0.5 h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Payments are applied directly to your balance.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="number"
                  min="1"
                  step="100"
                  value={tuitionPayment}
                  onChange={(e) => setTuitionPayment(e.target.value)}
                  className="h-9 w-28 rounded-md border border-input bg-background px-2 text-sm"
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
            </div>
          </DecisionPanel>
        ) : null}

        {notEnrolled ? (
          <DecisionPanel
            title="Enroll in a program"
            description={`GPA ${education.gpa.toFixed(2)} · ${education.credentials.length} credentials on record`}
            className="mb-6"
          >
            <ul className="divide-y divide-border">
              {EDUCATION_PROGRAMS.map((program) => (
                <li
                  key={program.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{program.programName}</p>
                    <p className="text-sm text-muted-foreground">{program.institution}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{program.creditsRequired} credits</Badge>
                      <Badge variant="outline">
                        Tuition {formatMoney(program.tuitionCents, currency)}
                      </Badge>
                      <Badge variant="outline">Min GPA {program.minEnrollmentGpa.toFixed(1)}</Badge>
                    </div>
                  </div>
                  <Button
                    className="bg-accent hover:bg-accent/80 text-white shrink-0"
                    disabled={busyAction !== null}
                    onClick={() => handleEducationAction("EDUCATION_ENROLL", { programId: program.id })}
                  >
                    Enroll
                  </Button>
                </li>
              ))}
            </ul>
          </DecisionPanel>
        ) : null}

        {education.enrolled ? (
          <>
            <section className="mb-6 border-b border-border pb-6">
              <h2 className="font-display flex items-center gap-2 text-xl text-foreground">
                <BookOpen className="h-5 w-5 text-secondary" aria-hidden />
                {education.programName}
              </h2>
              <div className="mt-3 space-y-4">
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge variant="outline">{education.institution}</Badge>
                  <Badge variant="outline">GPA {education.gpa.toFixed(2)}</Badge>
                  <Badge variant="outline">Effort: {effortLevelLabel(education.effortLevel)}</Badge>
                  {education.probation ? (
                    <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Academic probation
                    </Badge>
                  ) : null}
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-muted-foreground">Credits</span>
                    <span className="text-foreground">
                      {education.creditsCompleted}/{education.creditsRequired} ({programProgress}%)
                    </span>
                  </div>
                  <Progress value={programProgress} className="h-2 bg-accent" />
                </div>

                <dl className="grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-muted-foreground">Attendance</dt>
                    <dd className="font-medium text-foreground">{education.attendanceScore}%</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Study this week</dt>
                    <dd className="font-medium text-foreground">{education.studyHoursThisWeek}h</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Tuition due</dt>
                    <dd className="font-medium text-foreground">
                      {education.tuitionDueCents > 0
                        ? formatMoney(education.tuitionDueCents, currency)
                        : "Paid"}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <DecisionPanel title="School actions" description="Choose your effort level, then spend time studying." className="mb-6">
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Effort level</p>
                  <div className="flex flex-wrap gap-2">
                    {effortLevels.map((level) => (
                      <Button
                        key={level}
                        variant={education.effortLevel === level ? "default" : "outline"}
                        className={education.effortLevel === level ? "bg-accent hover:bg-accent/80 text-white" : ""}
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
                    className="bg-accent hover:bg-accent/80 text-white"
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
              </div>
            </DecisionPanel>
          </>
        ) : null}

        {graduated ? (
          <section className="mb-6 border-b border-border pb-6">
              <h2 className="font-display flex items-center gap-2 text-xl text-foreground">
                <Award className="w-5 h-5 text-fenix-gold" />
                Graduated
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Program complete — credentials unlocked. Enroll again to pursue another degree.
              </p>
          </section>
        ) : null}

        <section className="mb-6">
            <h2 className="font-display flex items-center gap-2 text-xl text-foreground">
              <Award className="w-5 h-5 text-fenix-gold" />
              Credentials
            </h2>
          <div className="mt-3">
            {education.credentials.length === 0 ? (
              <EmptyState title="No credentials yet" description="Complete a program to earn credentials." />
            ) : (
              <ul className="divide-y divide-border">
              {education.credentials.map((credential) => (
                <li key={credential.id} className="flex items-center gap-4 py-3">
                  <Award className="h-5 w-5 shrink-0 text-secondary" aria-hidden />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{credential.name}</div>
                    <div className="text-sm text-muted-foreground">{credential.institution}</div>
                  </div>
                  <Badge variant="outline">GPA {credential.gpa.toFixed(2)}</Badge>
                  <Badge variant="outline">{credential.earnedDate}</Badge>
                </li>
              ))}
              </ul>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
            <Briefcase className="w-8 h-8 text-fenix-gold shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-foreground">Career growth lives on the Career screen</div>
              <div className="text-sm text-muted-foreground">
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
        </section>
    </LifeShell>
  );
}
