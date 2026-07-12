import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  TrendingUp,
  BookOpen,
  Users,
  AlertCircle,
  Clock,
  Wallet,
  Brain,
  CheckCircle2,
  XCircle,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import {
  activeJobApplications,
  employmentStatusLabel,
  formatJobSalary,
  formatMoney,
  getAvailableJobListings,
  JOB_APPLICATION_FEE_CENTS,
  JOB_APPLICATION_RESOLVE_DAYS,
  jobListingMatchScore,
  NETWORK_COOLDOWN_TICKS,
  PROMOTION_COOLDOWN_TICKS,
  PROMOTION_MIN_MONTHS,
  PROMOTION_MIN_PERFORMANCE,
  RAISE_COOLDOWN_TICKS,
  RAISE_MIN_MONTHS,
  RAISE_MIN_PERFORMANCE,
  UPSKILL_COOLDOWN_TICKS,
  unemploymentPhaseLabel,
  unemploymentRunwayMonths,
  weeksUnemployed,
} from "@fenix/domain";

type CareerActionKind =
  | "CAREER_REQUEST_RAISE"
  | "CAREER_REQUEST_PROMOTION"
  | "CAREER_UPSKILL"
  | "CAREER_NETWORK"
  | "CAREER_QUIT";

function cooldownDaysRemaining(tickCount: number, lastTick: number, cooldown: number): number {
  return Math.max(0, cooldown - (tickCount - lastTick));
}

export default function CareerScreen() {
  const navigate = useNavigate();
  const { world, applyAction } = useSimulation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [applyFeedback, setApplyFeedback] = useState<string | null>(null);
  const [busyListingId, setBusyListingId] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const simulationGate = useSimulationGate("Loading career profile…");
  if (simulationGate) return simulationGate;
  if (!world) return null;

  const isUnemployed = world.career.status === "unemployed";
  const isEmployed = world.career.status === "employed";
  const applications = world.career.applications ?? [];
  const pendingApplications = activeJobApplications(applications);
  const tickCount = world.clock.tickCount;
  const career = world.career;
  const currency = world.origin.currency;

  const unemploymentStats = isUnemployed
    ? {
        weeks: weeksUnemployed(career.unemployedSinceDate, world.currentDate),
        phase: unemploymentPhaseLabel(
          weeksUnemployed(career.unemployedSinceDate, world.currentDate),
        ),
        runwayMonths: unemploymentRunwayMonths(world.banking),
        pending: pendingApplications.length,
        stress: world.player.traits.stress,
      }
    : null;

  const cooldowns = {
    raise: cooldownDaysRemaining(tickCount, career.lastRaiseTick, RAISE_COOLDOWN_TICKS),
    promotion: cooldownDaysRemaining(tickCount, career.lastPromotionTick, PROMOTION_COOLDOWN_TICKS),
    upskill: cooldownDaysRemaining(tickCount, career.lastUpskillTick, UPSKILL_COOLDOWN_TICKS),
    network: cooldownDaysRemaining(tickCount, career.lastNetworkTick, NETWORK_COOLDOWN_TICKS),
  };

  const listings = getAvailableJobListings({
    career: world.career,
    education: world.education,
  });

  async function handleApply(listingId: string) {
    setActionError(null);
    setApplyFeedback(null);
    setBusyListingId(listingId);
    try {
      await applyAction({ kind: "CAREER_APPLY_JOB", listingId });
      setApplyFeedback(
        `Application submitted — decisions typically resolve within ${JOB_APPLICATION_RESOLVE_DAYS} days.`,
      );
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Application failed.");
    } finally {
      setBusyListingId(null);
    }
  }

  async function handleCareerAction(kind: CareerActionKind) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA] p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/home")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl text-[#1C2541] flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-[#2EC4B6]" />
            Career
          </h1>
          <p className="text-gray-600 mt-1">
            {isUnemployed
              ? "Browse open roles, track applications, and manage your search."
              : "Manage your current role and grow your Human Capital."}
          </p>
        </div>

        {actionError ? (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{actionError}</p>
        ) : null}
        {applyFeedback ? (
          <p className="mb-4 text-sm text-[#1C2541] bg-[#2EC4B6]/10 border border-[#2EC4B6]/30 rounded-lg p-3">{applyFeedback}</p>
        ) : null}

        <Card className="border-[#2EC4B6]/20 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-[#1C2541]">Current status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{employmentStatusLabel(career.status)}</Badge>
              <Badge variant="outline">Performance {career.performanceScore}%</Badge>
              <Badge variant="outline">{career.monthsInRole} months in role</Badge>
              {!isUnemployed ? (
                <Badge variant="outline">
                  {formatMoney(career.monthlySalaryCents, currency)}/mo
                </Badge>
              ) : null}
            </div>
            <p className="text-sm text-gray-600">
              {isUnemployed
                ? `${career.jobTitle} · ${career.employerName}`
                : `${career.jobTitle} at ${career.employerName}`}
            </p>
            <p className="text-xs text-gray-500">{career.yearsExperience} years experience</p>
          </CardContent>
        </Card>

        {career.pipActive ? (
          <Card className="border-red-200 shadow-lg mb-6 bg-red-50/40" data-testid="pip-warning">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#1C2541]">Performance Improvement Plan active</p>
                <p className="text-sm text-gray-600 mt-1">
                  {career.pipDaysRemaining} days remaining · {career.warnings} warning
                  {career.warnings === 1 ? "" : "s"} on file. Raises and promotions are blocked until the PIP clears.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : career.warnings > 0 ? (
          <Card className="border-orange-200 shadow-lg mb-6 bg-orange-50/30">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                {career.warnings} performance warning{career.warnings === 1 ? "" : "s"} — improve delivery before the next review.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {pendingApplications.length > 0 ? (
          <Card className="border-[#2EC4B6]/20 shadow-lg mb-6" data-testid="pending-applications">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Pending applications</CardTitle>
              <p className="text-sm text-gray-600">
                {pendingApplications.length} in pipeline — employers respond after a few days of game time.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingApplications.map((application) => (
                <div key={application.id} className="rounded-lg border border-gray-200 p-4 bg-white">
                  <p className="text-[#1C2541] font-medium">{application.listingTitle}</p>
                  <p className="text-sm text-gray-600">{application.employerName}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Applied {application.appliedDate}
                    {application.resolveOnDate ? ` · Decision by ${application.resolveOnDate}` : ""}
                    {" · "}Match {application.matchScore}%
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        {isUnemployed && unemploymentStats ? (
          <Card className="border-orange-200 shadow-lg mb-6 bg-orange-50/40" data-testid="unemployment-panel">
            <CardHeader>
              <CardTitle className="text-[#1C2541] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Unemployment dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-[#1C2541] font-medium">{unemploymentStats.weeks} weeks</p>
                  <p className="text-xs text-gray-600">{unemploymentStats.phase}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Wallet className="w-5 h-5 text-[#2EC4B6] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Runway</p>
                  <p className="text-[#1C2541] font-medium">{unemploymentStats.runwayMonths} months</p>
                  <p className="text-xs text-gray-600">Liquid cash ÷ monthly burn</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-[#1C2541] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Applications</p>
                  <p className="text-[#1C2541] font-medium">{applications.length} total</p>
                  <p className="text-xs text-gray-600">{unemploymentStats.pending} pending review</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-orange-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Morale / stress</p>
                  <p className="text-[#1C2541] font-medium">{unemploymentStats.stress}%</p>
                  <p className="text-xs text-gray-600">Upskill or network to recover confidence</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {applications.length > 0 ? (
          <Card className="border-[#1C2541]/20 shadow-lg mb-6" data-testid="application-history">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Application history</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-lg border border-gray-200 p-4 bg-white flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex-1">
                    <p className="text-[#1C2541] font-medium">{application.listingTitle}</p>
                    <p className="text-sm text-gray-600">{application.employerName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Applied {application.appliedDate} · Match {application.matchScore}%
                      {application.resolveOnDate && application.status === "pending"
                        ? ` · Resolves ~${application.resolveOnDate}`
                        : ""}
                    </p>
                    {application.rejectionReason ? (
                      <p className="text-xs text-orange-700 mt-1">{application.rejectionReason}</p>
                    ) : null}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      application.status === "accepted"
                        ? "bg-[#2EC4B6]/10 text-[#2EC4B6] border-[#2EC4B6]/30"
                        : application.status === "rejected"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : ""
                    }
                  >
                    {application.status === "accepted" ? (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Hired
                      </span>
                    ) : application.status === "rejected" ? (
                      <span className="inline-flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Declined
                      </span>
                    ) : (
                      "Pending"
                    )}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        {isUnemployed ? (
          <Card className="border-[#F4B400]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#F4B400]" />
                Job listings
              </CardTitle>
              <p className="text-sm text-gray-600">
                Application fee: {formatMoney(JOB_APPLICATION_FEE_CENTS, currency)} per role · resolves in ~
                {JOB_APPLICATION_RESOLVE_DAYS} days
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {listings.length === 0 ? (
                <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 p-4">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#1C2541] font-medium">No listings match yet</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Improve career performance through education, networking, or adolescence choices.
                    </p>
                    <Button variant="outline" className="mt-3" onClick={() => navigate("/education")}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Education & skills
                    </Button>
                  </div>
                </div>
              ) : (
                listings.map((listing) => {
                  const match = jobListingMatchScore(listing, career.performanceScore, world.education);
                  return (
                    <div
                      key={listing.id}
                      className="rounded-lg border border-[#2EC4B6]/20 p-4 bg-white flex flex-col sm:flex-row sm:items-center gap-4"
                      data-testid={`job-listing-${listing.id}`}
                    >
                      <div className="flex-1">
                        <p className="text-[#1C2541] font-medium">{listing.title}</p>
                        <p className="text-sm text-gray-600">{listing.employerName}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">{listing.sector}</Badge>
                          <Badge variant="outline">
                            {formatJobSalary(listing.monthlySalaryCents, currency)}/mo
                          </Badge>
                          <Badge variant="outline">Match {match}%</Badge>
                        </div>
                      </div>
                      <Button
                        className="bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white shrink-0"
                        disabled={busyListingId !== null}
                        data-testid={`apply-job-${listing.id}`}
                        onClick={() => handleApply(listing.id)}
                      >
                        {busyListingId === listing.id ? "Applying…" : "Apply"}
                      </Button>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-[#F4B400]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#F4B400]" />
                Career actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEmployed ? (
                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    Raise: need {RAISE_MIN_MONTHS}+ months (you have {career.monthsInRole}), performance ≥
                    {RAISE_MIN_PERFORMANCE}%
                    {cooldowns.raise > 0 ? ` · cooldown ${cooldowns.raise}d` : " · ready"}
                  </p>
                  <p>
                    Promotion: need {PROMOTION_MIN_MONTHS}+ months, performance ≥{PROMOTION_MIN_PERFORMANCE}%
                    {cooldowns.promotion > 0 ? ` · cooldown ${cooldowns.promotion}d` : " · ready"}
                  </p>
                </div>
              ) : null}
              <div className="flex flex-wrap gap-3">
                {isEmployed ? (
                  <>
                    <Button
                      className="bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white"
                      disabled={
                        busyAction !== null ||
                        career.pipActive ||
                        cooldowns.raise > 0 ||
                        career.monthsInRole < RAISE_MIN_MONTHS ||
                        career.performanceScore < RAISE_MIN_PERFORMANCE
                      }
                      onClick={() => handleCareerAction("CAREER_REQUEST_RAISE")}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Request Raise
                    </Button>
                    <Button
                      variant="outline"
                      disabled={
                        busyAction !== null ||
                        career.pipActive ||
                        cooldowns.promotion > 0 ||
                        career.monthsInRole < PROMOTION_MIN_MONTHS ||
                        career.performanceScore < PROMOTION_MIN_PERFORMANCE
                      }
                      onClick={() => handleCareerAction("CAREER_REQUEST_PROMOTION")}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Request Promotion
                    </Button>
                  </>
                ) : null}
                <Button
                  variant="outline"
                  disabled={busyAction !== null || cooldowns.upskill > 0}
                  onClick={() => handleCareerAction("CAREER_UPSKILL")}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Upskill ($300){cooldowns.upskill > 0 ? ` · ${cooldowns.upskill}d` : ""}
                </Button>
                <Button
                  variant="outline"
                  disabled={busyAction !== null || cooldowns.network > 0}
                  onClick={() => handleCareerAction("CAREER_NETWORK")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Network ($150){cooldowns.network > 0 ? ` · ${cooldowns.network}d` : ""}
                </Button>
                {isEmployed ? (
                  <Button
                    variant="outline"
                    className="text-orange-700 border-orange-200 hover:bg-orange-50"
                    disabled={busyAction !== null}
                    onClick={() => handleCareerAction("CAREER_QUIT")}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Resign
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
