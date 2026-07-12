import { useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  LogOut,
  TrendingUp,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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
import { DecisionPanel, EmptyState, LifeShell } from "../components/shell";

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
  const { world, applyAction, formattedDate } = useSimulation();
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
    <LifeShell
      playerName={world.player.displayName}
      ageYears={world.player.ageYears}
      dateLabel={formattedDate ?? undefined}
      statusLine={employmentStatusLabel(career.status)}
    >
      <header className="mb-6">
        <p className="text-sm text-muted-foreground">Jobs</p>
        <h1 className="font-display text-3xl text-foreground tracking-tight">Career</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isUnemployed
            ? "Browse roles, track applications, manage your search."
            : `${career.jobTitle} at ${career.employerName}`}
        </p>
      </header>

      {actionError ? (
        <p className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          {actionError}
        </p>
      ) : null}
      {applyFeedback ? (
        <p className="mb-4 text-sm text-secondary bg-secondary/10 border border-secondary/30 rounded-lg p-3">
          {applyFeedback}
        </p>
      ) : null}

      <section className="mb-6 rounded-lg border border-border bg-surface-1 p-4">
        <h2 className="font-display text-lg text-foreground mb-3">Status</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline">{employmentStatusLabel(career.status)}</Badge>
          <Badge variant="outline">Performance {career.performanceScore}%</Badge>
          <Badge variant="outline">{career.monthsInRole} months in role</Badge>
          {!isUnemployed ? (
            <Badge variant="outline">{formatMoney(career.monthlySalaryCents, currency)}/mo</Badge>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">
          {career.jobTitle}
          {career.employerName ? ` · ${career.employerName}` : ""} · {career.yearsExperience} yrs experience
        </p>
      </section>

      {career.pipActive ? (
        <section
          className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 flex gap-3"
          data-testid="pip-warning"
          role="alert"
        >
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="font-medium text-foreground">Performance Improvement Plan</p>
            <p className="text-sm text-muted-foreground mt-1">
              {career.pipDaysRemaining} days left · {career.warnings} warning
              {career.warnings === 1 ? "" : "s"}. Raises and promotions blocked.
            </p>
          </div>
        </section>
      ) : career.warnings > 0 ? (
        <section className="mb-6 rounded-lg border border-status-warn/40 bg-surface-crisis p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden />
          <p className="text-sm text-foreground">
            {career.warnings} performance warning{career.warnings === 1 ? "" : "s"} — improve before the next review.
          </p>
        </section>
      ) : null}

      {pendingApplications.length > 0 ? (
        <section className="mb-6" data-testid="pending-applications">
          <h2 className="font-display text-lg text-foreground mb-2">Pending applications</h2>
          <ul className="divide-y divide-border rounded-lg border border-border bg-surface-1">
            {pendingApplications.map((application) => (
              <li key={application.id} className="px-4 py-3">
                <p className="font-medium text-foreground">{application.listingTitle}</p>
                <p className="text-sm text-muted-foreground">{application.employerName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Applied {application.appliedDate}
                  {application.resolveOnDate ? ` · Decision by ${application.resolveOnDate}` : ""}
                  {" · "}Match {application.matchScore}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {isUnemployed && unemploymentStats ? (
        <section className="mb-6 rounded-lg border border-border bg-surface-1 p-4" data-testid="unemployment-panel">
          <h2 className="font-display text-lg text-foreground mb-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-secondary" aria-hidden />
            Job search
          </h2>
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex gap-2">
              <Clock className="w-4 h-4 text-muted-foreground mt-0.5" aria-hidden />
              <div>
                <dt className="text-muted-foreground">Duration</dt>
                <dd className="font-medium">{unemploymentStats.weeks} weeks · {unemploymentStats.phase}</dd>
              </div>
            </div>
            <div className="flex gap-2">
              <Wallet className="w-4 h-4 text-muted-foreground mt-0.5" aria-hidden />
              <div>
                <dt className="text-muted-foreground">Runway</dt>
                <dd className="font-medium">{unemploymentStats.runwayMonths} months</dd>
              </div>
            </div>
          </dl>
        </section>
      ) : null}

      {isUnemployed ? (
        <DecisionPanel
          title="Open roles"
          description={`Fee ${formatMoney(JOB_APPLICATION_FEE_CENTS, currency)} · ~${JOB_APPLICATION_RESOLVE_DAYS} days to decide`}
        >
          {listings.length === 0 ? (
            <EmptyState
              title="No listings match yet"
              description="Improve through education, networking, or adolescence choices."
              action={
                <Button variant="outline" onClick={() => navigate("/education")}>
                  <BookOpen className="w-4 h-4 mr-2" aria-hidden />
                  Education
                </Button>
              }
            />
          ) : (
            <ul className="space-y-3">
              {listings.map((listing) => {
                const match = jobListingMatchScore(listing, career.performanceScore, world.education);
                return (
                  <li
                    key={listing.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-border pb-3 last:border-0"
                    data-testid={`job-listing-${listing.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{listing.title}</p>
                      <p className="text-sm text-muted-foreground">{listing.employerName}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {listing.sector} · {formatJobSalary(listing.monthlySalaryCents, currency)}/mo · Match {match}%
                      </p>
                    </div>
                    <Button
                      className="bg-secondary text-secondary-foreground hover:opacity-90 shrink-0"
                      disabled={busyListingId !== null}
                      data-testid={`apply-job-${listing.id}`}
                      onClick={() => handleApply(listing.id)}
                    >
                      {busyListingId === listing.id ? "Applying…" : "Apply"}
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </DecisionPanel>
      ) : (
        <DecisionPanel title="Career actions" description="Cooldowns and gates shown honestly.">
          {isEmployed ? (
            <div className="text-xs text-muted-foreground space-y-1 mb-4">
              <p>
                Raise: {RAISE_MIN_MONTHS}+ months (you have {career.monthsInRole}), performance ≥
                {RAISE_MIN_PERFORMANCE}%
                {cooldowns.raise > 0 ? ` · cooldown ${cooldowns.raise}d` : " · ready"}
              </p>
              <p>
                Promotion: {PROMOTION_MIN_MONTHS}+ months, performance ≥{PROMOTION_MIN_PERFORMANCE}%
                {cooldowns.promotion > 0 ? ` · cooldown ${cooldowns.promotion}d` : " · ready"}
              </p>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {isEmployed ? (
              <>
                <Button
                  className="bg-secondary text-secondary-foreground hover:opacity-90"
                  disabled={
                    busyAction !== null ||
                    career.pipActive ||
                    cooldowns.raise > 0 ||
                    career.monthsInRole < RAISE_MIN_MONTHS ||
                    career.performanceScore < RAISE_MIN_PERFORMANCE
                  }
                  onClick={() => handleCareerAction("CAREER_REQUEST_RAISE")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" aria-hidden />
                  Request raise
                  {cooldowns.raise > 0 ? ` (${cooldowns.raise}d)` : ""}
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
                  Request promotion
                  {cooldowns.promotion > 0 ? ` (${cooldowns.promotion}d)` : ""}
                </Button>
              </>
            ) : null}
            <Button
              variant="outline"
              disabled={busyAction !== null || cooldowns.upskill > 0}
              onClick={() => handleCareerAction("CAREER_UPSKILL")}
            >
              <BookOpen className="w-4 h-4 mr-2" aria-hidden />
              Upskill{cooldowns.upskill > 0 ? ` · ${cooldowns.upskill}d` : ""}
            </Button>
            <Button
              variant="outline"
              disabled={busyAction !== null || cooldowns.network > 0}
              onClick={() => handleCareerAction("CAREER_NETWORK")}
            >
              <Users className="w-4 h-4 mr-2" aria-hidden />
              Network{cooldowns.network > 0 ? ` · ${cooldowns.network}d` : ""}
            </Button>
            {isEmployed ? (
              <Button
                variant="outline"
                className="text-destructive border-destructive/30"
                disabled={busyAction !== null}
                onClick={() => handleCareerAction("CAREER_QUIT")}
              >
                <LogOut className="w-4 h-4 mr-2" aria-hidden />
                Resign
              </Button>
            ) : null}
          </div>
          <Button variant="link" className="mt-3 px-0" onClick={() => navigate("/education")}>
            School & credentials →
          </Button>
        </DecisionPanel>
      )}

      {applications.length > 0 ? (
        <section className="mt-8" data-testid="application-history">
          <h2 className="font-display text-lg text-foreground mb-3">Application history</h2>
          <ul className="divide-y divide-border rounded-lg border border-border bg-surface-1">
            {applications.map((application) => (
              <li key={application.id} className="flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{application.listingTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {application.employerName} · Match {application.matchScore}% · {application.appliedDate}
                  </p>
                  {application.rejectionReason ? (
                    <p className="text-xs text-destructive mt-1">{application.rejectionReason}</p>
                  ) : null}
                </div>
                <Badge variant="outline" className="shrink-0 w-fit">
                  {application.status === "accepted" ? (
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" aria-hidden /> Hired
                    </span>
                  ) : application.status === "rejected" ? (
                    <span className="inline-flex items-center gap-1">
                      <XCircle className="w-3 h-3" aria-hidden /> Declined
                    </span>
                  ) : (
                    "Pending"
                  )}
                </Badge>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </LifeShell>
  );
}
