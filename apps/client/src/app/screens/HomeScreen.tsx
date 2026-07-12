import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Briefcase,
  Building2,
  ChevronDown,
  GraduationCap,
  Heart,
  Map,
  SkipForward,
  Smartphone,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { formatSaveDate, useSave } from "@/context/SaveContext";
import { useSimulation } from "@/context/SimulationContext";
import { estimateCatchUpDays } from "@fenix/simulation-engine";
import { isCatchUpApplied } from "@/lib/catch-up-session";
import {
  deriveBlockingGates,
  employmentStatusLabel,
  formatMoney,
  formatOriginLocation,
  getLifePathHintActions,
  hasHardBlockingGate,
  lifePathHintTitle,
  totalNetWorthCents,
  type TimeScale,
} from "@fenix/domain";
import { FiveCapitalsStrip } from "../components/FiveCapitalsStrip";
import { LifeGateBanner } from "../components/LifeGateBanner";
import {
  CrisisModal,
  ErrorState,
  LifeShell,
  LoadingState,
  fadeUp,
  motionDurations,
  preferReducedMotion,
} from "../components/shell";
import { cn } from "../components/ui/utils";

const TIME_SCALES: TimeScale[] = [1, 2, 5];

const DESTINATIONS = [
  { label: "City", icon: Map, path: "/city" },
  { label: "Career", icon: Briefcase, path: "/career" },
  { label: "Education", icon: GraduationCap, path: "/education" },
  { label: "Phone", icon: Smartphone, path: "/phone" },
  { label: "Money", icon: Building2, path: "/banking" },
  { label: "Family", icon: Heart, path: "/family" },
] as const;

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
    tickCount,
  } = useSimulation();
  const [advancing, setAdvancing] = useState(false);
  const [simError, setSimError] = useState<string | null>(null);
  const [financesOpen, setFinancesOpen] = useState(false);
  const [capitalsOpen, setCapitalsOpen] = useState(false);
  const [crisisDismissed, setCrisisDismissed] = useState(false);
  const reduce = preferReducedMotion();

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
  const netWorth = totalNetWorthCents(world.banking);
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
      : employmentStatusLabel(career.status);

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

  return (
    <LifeShell
      playerName={world.player.displayName}
      ageYears={world.player.ageYears}
      dateLabel={displayDate}
      paused={isPaused}
      statusLine={`${locationLabel} · Day ${tickCount + 1}${isSaving ? " · Saving…" : ""}${
        hasHardBlockingGate(world) ? " · Crisis" : ""
      }`}
      onTogglePause={handleTogglePause}
    >
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

      <motion.section
        className="motion-enter"
        initial={reduce ? false : fadeUp.initial}
        animate={reduce ? undefined : fadeUp.animate}
        transition={{ duration: motionDurations.base }}
      >
        <p className="text-sm text-muted-foreground">Your life today</p>
        <h1 className="font-display mt-1 text-3xl sm:text-4xl text-foreground tracking-tight">
          Age {world.player.ageYears}
        </h1>
        <p className="mt-2 max-w-xl text-base text-foreground/80">
          {statusOneLiner}
          {career.employerName ? ` at ${career.employerName}` : ""}. {displayDate}.
        </p>
      </motion.section>

      {simError ? (
        <p className="mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          {simError}
        </p>
      ) : null}

      <div className="mt-4">
        <LifeGateBanner world={world} />
      </div>

      <section className="mt-6" aria-label="Time controls">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTogglePause}
            aria-pressed={isPaused}
          >
            {isPaused ? "Resume" : "Pause"}
          </Button>
          {TIME_SCALES.map((scale) => (
            <Button
              key={scale}
              type="button"
              variant={timeScale === scale && !isPaused ? "default" : "outline"}
              size="sm"
              className={
                timeScale === scale && !isPaused
                  ? "bg-secondary text-secondary-foreground hover:opacity-90"
                  : ""
              }
              onClick={() => handleTimeScale(scale)}
            >
              {scale}x
            </Button>
          ))}
          <Button
            type="button"
            size="sm"
            className="bg-secondary text-secondary-foreground hover:opacity-90"
            onClick={handleAdvanceDay}
            disabled={isPaused || advancing || isSaving || hasHardBlockingGate(world)}
            data-testid="advance-day"
          >
            <SkipForward className="mr-1.5 h-4 w-4" aria-hidden />
            {advancing ? "Advancing…" : "Advance 1 Day"}
          </Button>
        </div>
      </section>

      {showLifePathHints ? (
        <section className="mt-8 border-t border-border pt-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl text-foreground">
                {lifePathHintTitle(world.lifePath)}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                First steps — any path works from any background.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismissHints}>
              Dismiss
            </Button>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {lifePathHints.map((hint) => (
              <li key={hint.path}>
                <button
                  type="button"
                  onClick={() => navigate(hint.path)}
                  className="w-full rounded-lg border border-accent/30 bg-surface-1 px-4 py-3 text-left transition-colors hover:border-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <p className="font-medium text-foreground">{hint.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{hint.reason}</p>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8" aria-label="Go somewhere">
        <h2 className="font-display text-xl text-foreground">Where to?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Six doors into your day.</p>
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3" data-testid="home-quick-actions">
          {DESTINATIONS.map((dest, index) => (
            <motion.li
              key={dest.path}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 0.04 * index, duration: motionDurations.base }}
            >
              <button
                type="button"
                onClick={() => navigate(dest.path)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border border-border bg-surface-1 px-4 py-3.5 text-left",
                  "transition-colors hover:border-secondary/50 hover:bg-surface-2",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
                )}
              >
                <dest.icon className="h-5 w-5 text-secondary shrink-0" aria-hidden />
                <span className="font-medium text-foreground">{dest.label}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="mt-8 border-t border-border pt-4">
        <button
          type="button"
          className="flex w-full items-center justify-between py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          aria-expanded={financesOpen}
          onClick={() => setFinancesOpen((v) => !v)}
        >
          <span className="font-display text-lg text-foreground">Finances</span>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            {formatMoney(netWorth, currency)}
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", financesOpen && "rotate-180")}
              aria-hidden
            />
          </span>
        </button>
        {financesOpen ? (
          <div className="mt-2 space-y-2 pb-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Checking</span>
              <span className="tabular-nums">{formatMoney(checking?.balanceCents ?? 0, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly burn</span>
              <span className="tabular-nums">
                −{formatMoney(world.banking.monthlyExpensesCents, currency)}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => navigate("/banking")}
            >
              Open bank portal
            </Button>
          </div>
        ) : null}
      </section>

      <section className="mt-4 border-t border-border pt-4">
        <button
          type="button"
          className="flex w-full items-center justify-between py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          aria-expanded={capitalsOpen}
          onClick={() => setCapitalsOpen((v) => !v)}
        >
          <span className="font-display text-lg text-foreground">Five Capitals</span>
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform", capitalsOpen && "rotate-180")}
            aria-hidden
          />
        </button>
        {capitalsOpen ? (
          <div className="mt-2">
            <FiveCapitalsStrip world={world} />
          </div>
        ) : null}
      </section>
    </LifeShell>
  );
}
