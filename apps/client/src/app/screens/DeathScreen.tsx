import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, Users, Landmark, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useSimulation } from '@/context/SimulationContext';
import { useSimulationGate } from '@/hooks/useSimulationGate';
import {
  computeEstateTransfer,
  formatMoney,
  selectHeir,
} from '@fenix/domain';
import { DecisionPanel, EmptyState, LifeShell } from "../components/shell";

function isEligibleHeir(relationship: string): boolean {
  const rel = relationship.toLowerCase();
  return (
    rel === 'spouse' ||
    rel === 'partner' ||
    rel === 'child' ||
    rel === 'sibling' ||
    rel === 'parent' ||
    rel === 'mother' ||
    rel === 'father'
  );
}

export default function DeathScreen() {
  const navigate = useNavigate();
  const { world, applyAction } = useSimulation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [keepCompany, setKeepCompany] = useState(false);

  const simulationGate = useSimulationGate('Preparing succession…');
  if (simulationGate) return simulationGate;
  if (!world) return null;

  if (!world.deathPending) {
    navigate('/home', { replace: true });
    return null;
  }

  const estate = computeEstateTransfer(
    world.banking,
    world.portfolio,
    world.housing,
    world.company,
    keepCompany,
  );
  const suggestedHeir = selectHeir(world);
  const heirs = world.family.members.filter((member) => isEligibleHeir(member.relationship));

  async function handleAcceptHeir(heirMemberId: string) {
    setActionError(null);
    setBusyId(heirMemberId);
    try {
      await applyAction({ kind: 'ACCEPT_HEIR', heirMemberId, keepCompany });
      navigate('/home', { replace: true });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not continue as heir.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <LifeShell
      playerName={world.deathPending.deceasedName}
      ageYears={world.player.ageYears}
      statusLine="A life remembered"
      showDock={false}
      className="bg-brand-atmosphere text-white"
      contentClassName="max-w-lg"
    >
      <div className="space-y-5 pt-8">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-2">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-white">A Life Ends</h1>
          <p className="text-sm text-muted-foreground">
            {world.deathPending.deceasedName} passed away on {world.deathPending.date}.
          </p>
          {world.deathPending.diagnosis ? (
            <p className="text-xs text-accent">{world.deathPending.diagnosis}</p>
          ) : null}
          <Badge variant="outline" className="capitalize">
            {world.deathPending.riskLabel} mortality risk
          </Badge>
        </div>

        <section className="space-y-3 border-y border-border py-5">
            <div className="flex items-center gap-2 text-secondary">
              <Landmark className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Estate Summary</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Liquid accounts</p>
                <p className="font-semibold">{formatMoney(estate.liquidCents, world.origin.currency)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Portfolio</p>
                <p className="font-semibold">{formatMoney(estate.portfolioCents, world.origin.currency)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Housing equity</p>
                <p className="font-semibold">{formatMoney(estate.housingCents, world.origin.currency)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Company proceeds</p>
                <p className="font-semibold">{formatMoney(estate.companyCents, world.origin.currency)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gross estate</p>
                <p className="font-semibold">{formatMoney(estate.grossEstateCents, world.origin.currency)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Inheritance tax (15%)</p>
                <p className="font-semibold text-accent">
                  -{formatMoney(estate.taxCents, world.origin.currency)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Net to heir</p>
                <p className="font-display text-xl text-secondary">
                  {formatMoney(estate.transferredCents, world.origin.currency)}
                </p>
              </div>
            </div>
        </section>

        {world.company ? (
          <DecisionPanel title="Company disposition" description={`${world.company.name} can transfer to your heir or be sold into the estate.`}>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={!keepCompany ? 'default' : 'outline'}
                  className={!keepCompany ? 'bg-secondary text-secondary-foreground' : ''}
                  onClick={() => setKeepCompany(false)}
                >
                  Sell for estate
                </Button>
                <Button
                  size="sm"
                  variant={keepCompany ? 'default' : 'outline'}
                  className={keepCompany ? 'bg-secondary text-secondary-foreground' : ''}
                  onClick={() => setKeepCompany(true)}
                >
                  Keep company
                </Button>
              </div>
          </DecisionPanel>
        ) : null}

        <DecisionPanel title="Continue as…" description="Choose the person who will carry this life forward.">

            {actionError ? (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {actionError}
              </p>
            ) : null}

            {heirs.length === 0 ? (
              <EmptyState title="No eligible heirs" description="Build family relationships during life to enable succession." />
            ) : (
              <div className="space-y-2">
                {heirs.map((member) => (
                  <Button
                    key={member.id}
                    variant="outline"
                    className="w-full justify-between"
                    disabled={busyId !== null}
                    onClick={() => handleAcceptHeir(member.id)}
                  >
                    <span>
                      {member.name}
                    </span>
                    <span className="text-xs capitalize text-muted-foreground">{member.relationship}</span>
                  </Button>
                ))}
              </div>
            )}

            {suggestedHeir && heirs.some((member) => member.id === suggestedHeir.id) ? (
              <Button
                className="w-full bg-secondary text-secondary-foreground hover:opacity-90"
                disabled={busyId !== null}
                onClick={() => handleAcceptHeir(suggestedHeir.id)}
              >
                Continue as {suggestedHeir.name} (recommended)
              </Button>
            ) : null}
        </DecisionPanel>
      </div>
    </LifeShell>
  );
}
