import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Clock, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useSave } from '@/context/SaveContext';
import { useSimulation } from '@/context/SimulationContext';
import { estimateCatchUpDays } from '@fenix/simulation-engine';
import { markCatchUpApplied } from '@/lib/catch-up-session';
import { formatMoney } from '@fenix/domain';
import type { WhileAwaySummary } from '@fenix/simulation-engine';

function ToneIcon({ tone }: { tone: 'success' | 'info' | 'warning' }) {
  switch (tone) {
    case 'success':
      return <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />;
    case 'info':
      return <CheckCircle className="w-4 h-4 text-[#2EC4B6] flex-shrink-0" />;
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
      return <Badge className="bg-[#2EC4B6]/10 text-[#2EC4B6] border-[#2EC4B6]/30">Info</Badge>;
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#1C2541]">
        <div className="text-center space-y-2">
          <Clock className="w-8 h-8 mx-auto text-[#2EC4B6] animate-spin" />
          <p className="text-sm text-slate-500">Catching up on your world…</p>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FA] text-[#1C2541] p-6 gap-4">
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md text-center">
          {error ?? 'Could not build catch-up summary'}
        </p>
        <Button onClick={() => navigate('/home', { replace: true })}>Continue</Button>
      </div>
    );
  }

  const netPositive = summary.netBankingDeltaCents >= 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-lg space-y-5">
        <div className="text-center space-y-1 pt-4">
          <div className="w-14 h-14 rounded-full bg-[#2EC4B6]/10 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-7 h-7 text-[#2EC4B6]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1C2541]">While You Were Away</h1>
          <p className="text-sm text-slate-500">
            {summary.daysSimulated} game day{summary.daysSimulated === 1 ? '' : 's'} simulated
          </p>
        </div>

        <Card className="border-[#E0E4EF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Checking Change</p>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    netPositive ? 'text-green-600' : 'text-red-600'
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
          </CardContent>
        </Card>

        {summary.beats.length > 0 && (
          <Card className="border-[#E0E4EF]">
            <CardContent className="p-5 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Highlights</p>
              {summary.beats.map((beat, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <ToneIcon tone={beat.tone} />
                  <span className="text-sm text-[#1C2541]">{beat.headline}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {summary.newEvents.length > 0 && (
          <Card className="border-[#E0E4EF]">
            <CardContent className="p-5 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Events ({summary.newEvents.length})
              </p>
              {summary.newEvents.slice(0, 8).map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <ToneBadge tone={event.tone} />
                  <span className="text-sm text-[#1C2541]">{event.headline}</span>
                </div>
              ))}
              {summary.newEvents.length > 8 && (
                <p className="text-xs text-slate-400 text-right">
                  +{summary.newEvents.length - 8} more events…
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Button
          className="w-full bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white"
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
    </div>
  );
}
