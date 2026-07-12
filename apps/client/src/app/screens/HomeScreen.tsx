import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  Heart,
  Map,
  Newspaper,
  TrendingUp,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { formatSaveDate, useSave } from "@/context/SaveContext";
import { useSimulation } from "@/context/SimulationContext";
import { estimateCatchUpDays } from "@fenix/simulation-engine";
import { isCatchUpApplied } from "@/lib/catch-up-session";
import {
  averageFamilyHappiness,
  buildCityDistricts,
  companyStageLabel,
  deriveBlockingGates,
  employmentStatusLabel,
  formatMoney,
  formatOriginLocation,
  getLifePathHintActions,
  hasHardBlockingGate,
  impactChangesLabel,
  lifePathHintTitle,
  portfolioGainPercent,
  type LifeGate,
  type PlayerAction,
  type SimEvent,
  type TimeScale,
  type WorldInstance,
} from "@fenix/domain";
import {
  CapitalStatGrid,
  DayAdvanceFab,
  LifeFeedCard,
  QuickDestinationList,
  TodaysDecisionPanel,
  TopIdentityBar,
  type DecisionAction,
  type DecisionMetric,
  type FeedCapitalTag,
  type LifeFeedAction,
  type QuickDestinationItem,
} from "../components/home";
import {
  CrisisModal,
  ErrorState,
  LifeShell,
  LoadingState,
} from "../components/shell";

const TIME_SCALES: TimeScale[] = [1, 2, 5];

function playerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

function eventWhenLabel(eventDate: string, currentDate: string): string {
  if (eventDate === currentDate) return "TODAY";
  const eventMs = Date.parse(eventDate);
  const currentMs = Date.parse(currentDate);
  if (!Number.isNaN(eventMs) && !Number.isNaN(currentMs)) {
    const dayMs = 86_400_000;
    if (currentMs - eventMs >= dayMs * 0.9 && currentMs - eventMs < dayMs * 1.5) {
      return "YESTERDAY";
    }
  }
  return eventDate;
}

function capitalTagForEvent(event: SimEvent): FeedCapitalTag | undefined {
  switch (event.category) {
    case "finance":
      return "financial";
    case "career":
      return "business";
    case "life":
      return "human";
    case "news":
      return undefined;
    default: {
      const _exhaustive: never = event.category;
      return _exhaustive;
    }
  }
}

function eventDetail(event: SimEvent, world: WorldInstance): string {
  if (event.impact && event.impact !== "none") {
    return `This changes: ${impactChangesLabel(event.impact)}`;
  }
  return `${event.headline} — day ${event.tickCount + 1}.`;
}

function feedActionsForEvent(
  event: SimEvent,
  world: WorldInstance,
  navigate: (path: string) => void,
  onPayLoan: () => void,
): LifeFeedAction[] {
  const loan = world.banking.activeLoan;
  const loanRelated =
    event.category === "finance" &&
    loan &&
    (loan.status === "delinquent" || loan.status === "defaulted" || (loan.missedPayments ?? 0) >= 1);

  if (loanRelated && event.tone === "warning") {
    return [{ label: "Pay now", onClick: onPayLoan }];
  }

  switch (event.category) {
    case "finance":
      return [{ label: "Open banking", onClick: () => navigate("/banking"), variant: "ghost" }];
    case "career":
      return [
        {
          label: world.company ? "View company" : "View career",
          onClick: () => navigate(world.company ? "/company" : "/career"),
          variant: "ghost",
        },
      ];
    case "life":
      return [{ label: "Open family", onClick: () => navigate("/family"), variant: "ghost" }];
    case "news":
      return [{ label: "Read news", onClick: () => navigate("/news"), variant: "ghost" }];
    default: {
      const _exhaustive: never = event.category;
      return _exhaustive;
    }
  }
}

function decisionCopy(gate: LifeGate): { title: string; subtitle: string } {
  switch (gate.kind) {
    case "loan_default":
    case "loan_delinquent":
      return {
        title: "Settle the loan instalment?",
        subtitle:
          "Paying now protects your credit. Waiting frees cash but raises collections risk.",
      };
    case "tuition_overdue":
      return {
        title: "Clear the tuition balance?",
        subtitle: "Paying keeps enrollment on track. Dropping out ends the program.",
      };
    case "pip_active":
      return {
        title: "Respond to your performance plan?",
        subtitle: "Upskill to improve standing, or quit before termination risk rises.",
      };
    case "tax_filing_overdue":
      return {
        title: "File your taxes?",
        subtitle: "Resolve the refund or balance due before time can advance.",
      };
    case "illness_pending":
      return {
        title: "Address the illness?",
        subtitle: gate.message,
      };
    case "death_pending":
      return {
        title: "Choose an heir to continue",
        subtitle: gate.message,
      };
    default: {
      const _exhaustive: never = gate.kind;
      return _exhaustive;
    }
  }
}

function buildDecisionMetrics(gate: LifeGate, world: WorldInstance): DecisionMetric[] {
  const currency = world.origin.currency;
  const checking = world.banking.accounts.find((a) => a.id === "checking");
  const balance = formatMoney(checking?.balanceCents ?? 0, currency);
  const loan = world.banking.activeLoan;

  switch (gate.kind) {
    case "loan_default":
    case "loan_delinquent":
      return [
        { label: "Credit score", value: String(world.banking.creditScore) },
        {
          label: "Instalment",
          value: loan ? formatMoney(loan.monthlyPaymentCents, currency) : "—",
          tone: "danger",
        },
        { label: "Available balance", value: balance },
      ];
    case "tuition_overdue":
      return [
        {
          label: "Tuition due",
          value: formatMoney(world.education.tuitionDueCents, currency),
          tone: "danger",
        },
        { label: "Overdue days", value: String(world.education.tuitionOverdueDays ?? 0) },
        { label: "Available balance", value: balance },
      ];
    case "pip_active":
      return [
        { label: "Days remaining", value: String(world.career.pipDaysRemaining), tone: "danger" },
        { label: "Role", value: world.career.jobTitle || employmentStatusLabel(world.career.status) },
        { label: "Employer", value: world.career.employerName || "—" },
      ];
    case "tax_filing_overdue":
      return [
        { label: "Filing", value: "Overdue", tone: "danger" },
        { label: "Available balance", value: balance },
        { label: "Credit score", value: String(world.banking.creditScore) },
      ];
    case "illness_pending":
      return [
        { label: "Health", value: String(world.player.traits.health) },
        { label: "Energy", value: String(world.player.traits.energy) },
        { label: "Stress", value: String(world.player.traits.stress) },
      ];
    case "death_pending":
      return [
        { label: "Estate", value: "Pending succession" },
        { label: "Family", value: `${world.family.members.length} members` },
        { label: "Age", value: String(world.player.ageYears) },
      ];
    default: {
      const _exhaustive: never = gate.kind;
      return _exhaustive;
    }
  }
}

function buildDecisionActions(
  gate: LifeGate,
  world: WorldInstance,
  navigate: (path: string) => void,
  apply: (action: PlayerAction) => Promise<void>,
  busy: boolean,
): DecisionAction[] {
  const actions: DecisionAction[] = [];
  const currency = world.origin.currency;
  const loan = world.banking.activeLoan;

  for (const resolve of gate.resolveActions.slice(0, 2)) {
    switch (resolve) {
      case "PAY_LOAN":
        actions.push({
          label: loan
            ? `Pay ${formatMoney(loan.monthlyPaymentCents, currency)}`
            : "Pay loan",
          onClick: () => {
            apply({ kind: "PAY_LOAN" }).catch(console.error);
          },
          disabled: busy,
        });
        break;
      case "RESTRUCTURE_LOAN":
        actions.push({
          label: "Restructure",
          onClick: () => {
            apply({ kind: "RESTRUCTURE_LOAN" }).catch(console.error);
          },
          variant: "ghost",
          disabled: busy,
        });
        break;
      case "SETTLE_LOAN":
        actions.push({
          label: "Settle",
          onClick: () => {
            apply({ kind: "SETTLE_LOAN" }).catch(console.error);
          },
          variant: "ghost",
          disabled: busy,
        });
        break;
      case "EDUCATION_PAY_TUITION":
        actions.push({
          label: "Pay tuition",
          onClick: () => navigate(gate.route ?? "/education"),
          disabled: busy,
        });
        break;
      case "EDUCATION_DROP_OUT":
        actions.push({
          label: "Drop out",
          onClick: () => navigate(gate.route ?? "/education"),
          variant: "ghost",
          disabled: busy,
        });
        break;
      case "CAREER_UPSKILL":
        actions.push({
          label: "Upskill",
          onClick: () => {
            apply({ kind: "CAREER_UPSKILL" }).catch(console.error);
          },
          disabled: busy,
        });
        break;
      case "CAREER_QUIT":
        actions.push({
          label: "Quit job",
          onClick: () => {
            apply({ kind: "CAREER_QUIT" }).catch(console.error);
          },
          variant: "ghost",
          disabled: busy,
        });
        break;
      case "TREAT_ILLNESS":
        actions.push({
          label: "Treat",
          onClick: () => {
            apply({ kind: "TREAT_ILLNESS" }).catch(console.error);
          },
          disabled: busy,
        });
        break;
      case "IGNORE_ILLNESS":
        actions.push({
          label: "Ignore",
          onClick: () => {
            apply({ kind: "IGNORE_ILLNESS" }).catch(console.error);
          },
          variant: "ghost",
          disabled: busy,
        });
        break;
      case "FILE_TAXES":
        actions.push({
          label: "File taxes",
          onClick: () => {
            apply({ kind: "FILE_TAXES" }).catch(console.error);
          },
          disabled: busy,
        });
        break;
      case "PAY_TAX_BALANCE":
        actions.push({
          label: "Pay balance",
          onClick: () => {
            apply({ kind: "PAY_TAX_BALANCE" }).catch(console.error);
          },
          variant: "ghost",
          disabled: busy,
        });
        break;
      case "ACCEPT_HEIR":
        actions.push({
          label: "Choose heir",
          onClick: () => navigate(gate.route ?? "/death"),
          disabled: busy,
        });
        break;
      default: {
        const _exhaustive: never = resolve;
        void _exhaustive;
        break;
      }
    }
  }

  if (actions.length === 0 && gate.route) {
    actions.push({
      label: "Resolve",
      onClick: () => navigate(gate.route!),
      disabled: busy,
    });
  }

  return actions.slice(0, 2);
}

function happinessLabel(score: number): string {
  if (score >= 80) return "Happy";
  if (score >= 60) return "Steady";
  if (score >= 40) return "Strained";
  return "Low";
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { activeSave, isLoading } = useSave();
  const {
    world,
    formattedDate,
    isPaused,
    timeScale,
    isSaving,
    isLoading: simLoading,
    loadError,
    reloadSimulation,
    advanceDay,
    setPaused,
    setTimeScale,
    dismissLifePathHints,
    applyAction,
    tickCount,
  } = useSimulation();
  const [advancing, setAdvancing] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [simError, setSimError] = useState<string | null>(null);
  const [crisisDismissed, setCrisisDismissed] = useState(false);

  useEffect(() => {
    if (!isLoading && !activeSave) {
      navigate("/continue", { replace: true });
    }
  }, [activeSave, isLoading, navigate]);

  useEffect(() => {
    if (!simLoading && world) {
      if (world.deathPending) {
        navigate("/death", { replace: true });
        return;
      }
      if (!world.onboarding.adolescencePlayCompleted) {
        navigate("/childhood-play", { replace: true });
      } else if (!world.onboarding.childhoodSummarySeen) {
        navigate("/childhood-summary", { replace: true });
      } else if (activeSave?.lastPlayedAt && !isCatchUpApplied(activeSave.id)) {
        const catchUpDays = estimateCatchUpDays(activeSave.lastPlayedAt);
        if (catchUpDays > 0) {
          navigate("/while-away", { replace: true });
        }
      }
    }
  }, [simLoading, world, navigate, activeSave?.lastPlayedAt, activeSave?.id]);

  const destinations = useMemo((): QuickDestinationItem[] => {
    if (!world) return [];
    const credit = world.banking.creditScore;
    const gain = portfolioGainPercent(world.portfolio);
    const gainLabel = `${gain >= 0 ? "+" : ""}${gain.toFixed(1)}%`;
    const partner =
      world.family.members.find(
        (m) => m.relationship === "Partner" || m.relationship === "Spouse",
      ) ?? world.family.members[0];
    const happiness = averageFamilyHappiness(world.family);
    const districts = buildCityDistricts(world);
    const visited = Object.keys(world.districtVisits ?? {}).length;
    const companyTitle = world.company?.name ?? "Company";
    const companyMetric = world.company
      ? companyStageLabel(world.company.stage)
      : "Not founded";

    return [
      {
        path: "/banking",
        title: "Banking",
        subtitle: "Accounts, transfers, loans",
        metric: `${credit} score`,
        icon: Building2,
      },
      {
        path: "/company",
        title: companyTitle,
        subtitle: world.company ? "Runway, hiring, product" : "Found or grow a venture",
        metric: companyMetric,
        icon: Briefcase,
      },
      {
        path: "/stocks",
        title: "Stock Market",
        subtitle: "Portfolio & trading",
        metric: gainLabel,
        icon: TrendingUp,
      },
      {
        path: "/family",
        title: "Family",
        subtitle: partner
          ? `${partner.name.split(" ")[0]} · household`
          : "Household & relationships",
        metric: happinessLabel(happiness),
        icon: Heart,
      },
      {
        path: "/city",
        title: "City",
        subtitle: `${formatOriginLocation(world.origin)} districts`,
        metric: `${visited}/${districts.length} visited`,
        icon: Map,
      },
    ];
  }, [world]);

  if (!isLoading && !activeSave) {
    return null;
  }

  if (loadError) {
    return (
      <ErrorState
        message={loadError}
        onRetry={() => reloadSimulation()}
        secondaryAction={
          <Button variant="outline" onClick={() => navigate("/continue")}>
            Back to Saves
          </Button>
        }
        className="min-h-screen"
      />
    );
  }

  if (isLoading || simLoading || !world) {
    return <LoadingState label="Loading your life…" className="min-h-screen" />;
  }

  const displayDate = formattedDate ?? (activeSave ? formatSaveDate(activeSave.lastPlayedAt) : "");
  const locationLabel = formatOriginLocation(world.origin);
  const currency = world.origin.currency;
  const career = world.career;
  const checking = world.banking.accounts.find((a) => a.id === "checking");
  const lifePathHints = getLifePathHintActions(world.lifePath);
  const showLifePathHints = !world.onboarding.lifePathHintsSeen;
  const gates = deriveBlockingGates(world);
  const hardGates = gates.filter((g) => g.severity === "hard");
  const primaryGate = hardGates[0] ?? gates[0];
  const showCrisisModal = Boolean(primaryGate && hardGates.length > 0 && !crisisDismissed);
  const statusOneLiner =
    career.status === "employed" && career.jobTitle
      ? career.jobTitle
      : career.status === "founder" && world.company
        ? `Founder, ${world.company.name}`
        : employmentStatusLabel(career.status);

  const feedEvents = [...world.events].reverse().slice(0, 8);

  async function runAction(action: PlayerAction) {
    setSimError(null);
    setActionBusy(true);
    try {
      await applyAction(action);
    } catch (error) {
      setSimError(error instanceof Error ? error.message : "Could not complete action.");
    } finally {
      setActionBusy(false);
    }
  }

  async function handleAdvanceDay() {
    setSimError(null);
    setAdvancing(true);
    try {
      await advanceDay();
    } catch (error) {
      setSimError(error instanceof Error ? error.message : "Could not advance time.");
    } finally {
      setAdvancing(false);
    }
  }

  async function handleTimeScale(scale: TimeScale) {
    setSimError(null);
    try {
      if (isPaused) await setPaused(false);
      await setTimeScale(scale);
    } catch (error) {
      setSimError(error instanceof Error ? error.message : "Could not change time scale.");
    }
  }

  async function handleTogglePause() {
    setSimError(null);
    try {
      await setPaused(!isPaused);
    } catch (error) {
      setSimError(error instanceof Error ? error.message : "Could not pause or resume.");
    }
  }

  async function handleDismissHints() {
    setSimError(null);
    try {
      await dismissLifePathHints();
    } catch (error) {
      setSimError(error instanceof Error ? error.message : "Could not dismiss hints.");
    }
  }

  const decision = primaryGate
    ? {
        ...decisionCopy(primaryGate),
        metrics: buildDecisionMetrics(primaryGate, world),
        actions: buildDecisionActions(
          primaryGate,
          world,
          navigate,
          runAction,
          actionBusy || isSaving,
        ),
      }
    : null;

  return (
    <LifeShell showIdentity={false} showDock contentClassName="pb-[calc(var(--dock-height)+5.5rem)] md:pb-24">
      <CrisisModal
        open={showCrisisModal}
        severity="hard"
        title="Resolve this before time moves"
        message={primaryGate?.message ?? ""}
        primaryLabel={primaryGate?.route ? "Resolve" : undefined}
        onPrimary={
          primaryGate?.route
            ? () => {
                setCrisisDismissed(true);
                navigate(primaryGate.route!);
              }
            : undefined
        }
        secondaryLabel="View details"
        onSecondary={() => setCrisisDismissed(true)}
      />

      <TopIdentityBar
        initials={playerInitials(world.player.displayName)}
        name={world.player.displayName}
        meta={`Age ${world.player.ageYears} · ${statusOneLiner} · ${locationLabel}`}
        balanceValue={formatMoney(checking?.balanceCents ?? 0, currency)}
        paused={isPaused}
        onTogglePause={handleTogglePause}
      />

      <CapitalStatGrid world={world} />

      {simError ? (
        <p className="mb-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {simError}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-3.5 min-[900px]:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="mb-2.5 flex items-center justify-between px-0.5">
            <h2 className="font-display text-[14.5px] font-semibold text-foreground">Go to</h2>
            <span className="text-[11px] text-muted-foreground">quick destinations</span>
          </div>
          <QuickDestinationList items={destinations} />

          <div className="mb-2.5 flex items-center justify-between px-0.5">
            <h2 className="font-display text-[14.5px] font-semibold text-foreground">Your Life</h2>
            <span className="text-[11px] text-muted-foreground">
              {displayDate}
              {displayDate ? " — today" : ""}
            </span>
          </div>

          <div className="flex flex-col gap-2.5" data-testid="home-life-feed">
            {feedEvents.length === 0 ? (
              <p className="rounded-[var(--radius-home)] border border-border bg-surface-1 p-4 text-sm text-muted-foreground shadow-[var(--home-shadow)]">
                Your life feed is quiet. Advance a day to see what happens next.
              </p>
            ) : (
              feedEvents.map((event) => {
                const crisis = event.tone === "warning";
                const Icon =
                  event.category === "finance"
                    ? crisis
                      ? AlertTriangle
                      : TrendingUp
                    : event.category === "career"
                      ? Briefcase
                      : event.category === "news"
                        ? Newspaper
                        : Heart;
                return (
                  <LifeFeedCard
                    key={event.id}
                    headline={event.headline}
                    detail={eventDetail(event, world)}
                    whenLabel={eventWhenLabel(event.date, world.currentDate)}
                    capitalTag={capitalTagForEvent(event)}
                    crisis={crisis}
                    icon={<Icon className="h-4 w-4" aria-hidden />}
                    actions={feedActionsForEvent(
                      event,
                      world,
                      navigate,
                      () => {
                        runAction({ kind: "PAY_LOAN" }).catch(console.error);
                      },
                    )}
                  />
                );
              })
            )}
          </div>
        </div>

        <aside className="space-y-3.5">
          <div className="px-0.5">
            <h2 className="mb-2.5 font-display text-[14.5px] font-semibold text-foreground">
              Today&apos;s Decision
            </h2>
            {decision ? (
              <TodaysDecisionPanel
                title={decision.title}
                subtitle={decision.subtitle}
                metrics={decision.metrics}
                actions={decision.actions}
              />
            ) : (
              <TodaysDecisionPanel empty />
            )}
          </div>

          <section aria-label="Time controls" className="rounded-[var(--radius-home)] border border-border bg-surface-1 p-4 shadow-[var(--home-shadow)]">
            <p className="mb-2 text-[11.5px] text-muted-foreground">
              Day {tickCount + 1}
              {isSaving ? " · Saving…" : ""}
              {isPaused ? " · Paused" : ""}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {TIME_SCALES.map((scale) => (
                <Button
                  key={scale}
                  type="button"
                  variant={timeScale === scale && !isPaused ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    handleTimeScale(scale).catch(console.error);
                  }}
                >
                  {scale}x
                </Button>
              ))}
            </div>
          </section>

          {showLifePathHints ? (
            <section className="rounded-[var(--radius-home)] border border-accent/30 bg-surface-1 p-4 shadow-[var(--home-shadow)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-base text-foreground">
                    {lifePathHintTitle(world.lifePath)}
                  </h2>
                  <p className="mt-1 text-[11.5px] text-muted-foreground">
                    First steps — any path works from any background.
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => {
                  handleDismissHints().catch(console.error);
                }}>
                  Dismiss
                </Button>
              </div>
              <ul className="mt-3 grid gap-2">
                {lifePathHints.map((hint) => (
                  <li key={hint.path}>
                    <button
                      type="button"
                      onClick={() => navigate(hint.path)}
                      className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-left transition-colors hover:border-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <p className="text-sm font-medium text-foreground">{hint.label}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{hint.reason}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>

      <DayAdvanceFab
        onClick={() => {
          handleAdvanceDay().catch(console.error);
        }}
        busy={advancing}
        disabled={isPaused || isSaving || hasHardBlockingGate(world)}
      />
    </LifeShell>
  );
}
