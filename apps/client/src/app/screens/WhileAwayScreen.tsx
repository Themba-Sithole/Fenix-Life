import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Clock, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useSave } from '@/context/SaveContext';
import { useSimulation } from '@/context/SimulationContext';
import { estimateCatchUpDays } from '@fenix/simulation-engine';
import { markCatchUpApplied } from '@/lib/catch-up-session';
import { formatMoney } from '@fenix/domain';
import type { WhileAwaySummary } from '@fenix/simulation-engine';
import { DecisionPanel, LifeShell, LoadingState } from "../components/shell";

function ToneIcon({ tone }: { tone: 'success' | 'info' | 'warning' }) {
  switch (tone) {
    case 'success':
      return <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />;
    case 'info':
      return <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />;
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
}

function ToneBadge({ tone }: { tone: 'success' | 'info' | 'warning' }) {
  switch (tone) {
    case 'success':
      return <Badge className="bg-green-600/20 text-green-300 border-green-700">Gain</Badge>;
    case 'warning':
      return <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-700">Alert</Badge>;
    case 'info':
      return <Badge className="bg-accent/10 text-accent border-accent/30">Info</Badge>;
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
}

export default function WhileAwayScreen() {
  const navigate = useNavigate();
  const { activeSave } = useSave();
  const { world, applyCatchUp } = useSimulation();
  const [summary, setSummary] = useState<WhileAwaySummary | null>(null);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const appliedRef = useRef(false);

  const catchUpDays = useMemo(() => {
    if (!activeSave?.lastPlayedAt) return 0;
    return estimateCatchUpDays(activeSave.lastPlayedAt);
  }, [activeSave]);

  useEffect(() => {
    if (!world || catchUpDays <= 0) {
      navigate('/home', { replace: true });
      return;
    }

    if (appliedRef.current) {
      return;
    }

    appliedRef.current = true;
    setBuilding(true);
    setError(null);

    applyCatchUp(catchUpDays)
      .then((built) => {
        if (built) {
          setSummary(built);
        } else {
          navigate('/home', { replace: true });
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Catch-up failed');
        appliedRef.current = false;
      })
      .finally(() => {
        setBuilding(false);
      });
  }, [world, catchUpDays, navigate, applyCatchUp]);

  if (!world || building || (!summary && !error)) {
    return <LoadingState label="Catching up on your world…" className="min-h-screen" />;
  }

  if (error || !summary) {
    return (
      <LifeShell playerName={world?.player.displayName} ageYears={world?.player.ageYears} statusLine="Welcome back">
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="max-w-md rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-center text-sm text-destructive">
          {error ?? 'Could not build catch-up summary'}
        </p>
        <Button onClick={() => navigate('/home', { replace: true })}>Continue</Button>
        </div>
      </LifeShell>
    );
  }

  const netPositive = summary.netBankingDeltaCents >= 0;

  return (
    <LifeShell playerName={world.player.displayName} ageYears={world.player.ageYears} statusLine="Welcome back" contentClassName="max-w-lg">
      <div className="space-y-5">
        <div className="text-center space-y-1 pt-4">
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-7 h-7 text-accent" />
          </div>
          <h1 className="font-display text-3xl text-foreground">While You Were Away</h1>
          <p className="text-sm text-muted-foreground">
            {summary.daysSimulated} game day{summary.daysSimulated === 1 ? '' : 's'} simulated
          </p>
        </div>

        <section className="border-y border-border py-5">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Checking Change</p>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    netPositive ? 'text-secondary' : 'text-destructive'
                  }`}
                >
                  {netPositive ? '+' : ''}
                  {formatMoney(summary.netBankingDeltaCents, world.origin.currency)}
                </p>
              </div>
              {netPositive ? (
                <TrendingUp className="w-8 h-8 text-green-500 opacity-60" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-500 opacity-60" />
              )}
            </div>
        </section>

        {summary.beats.length > 0 && (
          <section className="space-y-3 border-b border-border pb-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Highlights</p>
              {summary.beats.map((beat, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <ToneIcon tone={beat.tone} />
                  <span className="text-sm text-foreground">{beat.headline}</span>
                </div>
              ))}
          </section>
        )}

        {summary.newEvents.length > 0 && (
          <section className="space-y-3 border-b border-border pb-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Events ({summary.newEvents.length})
              </p>
              {summary.newEvents.slice(0, 8).map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <ToneBadge tone={event.tone} />
                  <span className="text-sm text-foreground">{event.headline}</span>
                </div>
              ))}
              {summary.newEvents.length > 8 && (
                <p className="text-right text-xs text-muted-foreground">
                  +{summary.newEvents.length - 8} more events…
                </p>
              )}
          </section>
        )}

        <Button
          className="w-full bg-accent hover:bg-accent/80 text-white"
          onClick={() => {
            if (activeSave) {
              markCatchUpApplied(activeSave.id);
            }
            navigate('/home', { replace: true });
          }}
        >
          Continue Playing
        </Button>
      </div>
    </LifeShell>
  );
}
