import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, Users, Landmark, Building2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useSimulation } from '@/context/SimulationContext';
import { useSimulationGate } from '@/hooks/useSimulationGate';
import {
  computeEstateTransfer,
  formatMoney,
  selectHeir,
} from '@fenix/domain';

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
    <div className="min-h-screen bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#0B132B] p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-lg space-y-5 pt-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">A Life Ends</h1>
          <p className="text-sm text-gray-300">
            {world.deathPending.deceasedName} passed away on {world.deathPending.date}.
          </p>
          {world.deathPending.diagnosis ? (
            <p className="text-xs text-orange-300">{world.deathPending.diagnosis}</p>
          ) : null}
          <Badge className="bg-red-600/20 text-red-300 border-red-700 capitalize">
            {world.deathPending.riskLabel} mortality risk
          </Badge>
        </div>

        <Card className="border-[#E0E4EF]/20 bg-white/5 text-white">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#2EC4B6]">
              <Landmark className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Estate Summary</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Liquid accounts</p>
                <p className="font-semibold">{formatMoney(estate.liquidCents, world.origin.currency)}</p>
              </div>
              <div>
                <p className="text-gray-400">Portfolio</p>
                <p className="font-semibold">{formatMoney(estate.portfolioCents, world.origin.currency)}</p>
              </div>
              <div>
                <p className="text-gray-400">Housing equity</p>
                <p className="font-semibold">{formatMoney(estate.housingCents, world.origin.currency)}</p>
              </div>
              <div>
                <p className="text-gray-400">Company proceeds</p>
                <p className="font-semibold">{formatMoney(estate.companyCents, world.origin.currency)}</p>
              </div>
              <div>
                <p className="text-gray-400">Gross estate</p>
                <p className="font-semibold">{formatMoney(estate.grossEstateCents, world.origin.currency)}</p>
              </div>
              <div>
                <p className="text-gray-400">Inheritance tax (15%)</p>
                <p className="font-semibold text-yellow-300">
                  -{formatMoney(estate.taxCents, world.origin.currency)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400">Net to heir</p>
                <p className="text-xl font-bold text-[#2EC4B6]">
                  {formatMoney(estate.transferredCents, world.origin.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {world.company ? (
          <Card className="border-[#E0E4EF]/20 bg-white/5 text-white">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#2EC4B6]">
                <Building2 className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Company disposition</span>
              </div>
              <p className="text-sm text-gray-300">
                {world.company.name} — keep under the heir, or force-sell into the estate (BitLife-style).
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={!keepCompany ? 'default' : 'outline'}
                  className={!keepCompany ? 'bg-[#F4B400] text-[#0B132B]' : 'border-white/20 text-white'}
                  onClick={() => setKeepCompany(false)}
                >
                  Sell for estate
                </Button>
                <Button
                  size="sm"
                  variant={keepCompany ? 'default' : 'outline'}
                  className={keepCompany ? 'bg-[#2EC4B6] text-white' : 'border-white/20 text-white'}
                  onClick={() => setKeepCompany(true)}
                >
                  Keep company
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card className="border-[#E0E4EF]/20 bg-white/5 text-white">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-[#2EC4B6]">
              <Users className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Continue as…</span>
            </div>

            {actionError ? (
              <p className="text-sm text-red-300 bg-red-950/40 border border-red-800 rounded-lg p-3">
                {actionError}
              </p>
            ) : null}

            {heirs.length === 0 ? (
              <p className="text-sm text-gray-300">
                No eligible heirs found. Build family relationships during life to enable succession.
              </p>
            ) : (
              <div className="space-y-2">
                {heirs.map((member) => (
                  <Button
                    key={member.id}
                    variant="outline"
                    className="w-full justify-between border-white/20 text-white hover:bg-white/10"
                    disabled={busyId !== null}
                    onClick={() => handleAcceptHeir(member.id)}
                  >
                    <span>
                      {member.emoji} {member.name}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">{member.relationship}</span>
                  </Button>
                ))}
              </div>
            )}

            {suggestedHeir && heirs.some((member) => member.id === suggestedHeir.id) ? (
              <Button
                className="w-full bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white"
                disabled={busyId !== null}
                onClick={() => handleAcceptHeir(suggestedHeir.id)}
              >
                Continue as {suggestedHeir.name} (recommended)
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
