import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { computeFiveCapitals, FIVE_CAPITALS, type WorldInstance } from '@fenix/domain';

interface FiveCapitalsStripProps {
  world: WorldInstance;
}

const SCORE_COLORS: Record<(typeof FIVE_CAPITALS)[number]['key'], string> = {
  financial: 'bg-[#2EC4B6]',
  human: 'bg-[#F4B400]',
  social: 'bg-[#1C2541]',
  business: 'bg-[#2EC4B6]',
  legacy: 'bg-[#F4B400]',
};

export function FiveCapitalsStrip({ world }: FiveCapitalsStripProps) {
  const capitals = computeFiveCapitals({
    player: world.player,
    banking: world.banking,
    company: world.company,
    career: world.career,
    tickCount: world.clock.tickCount,
    currency: world.origin.currency,
  });

  const labels: Record<(typeof FIVE_CAPITALS)[number]['key'], string> = {
    financial: capitals.financialLabel,
    human: capitals.humanLabel,
    social: capitals.socialLabel,
    business: capitals.businessLabel,
    legacy: capitals.legacyLabel,
  };

  const scores: Record<(typeof FIVE_CAPITALS)[number]['key'], number> = {
    financial: capitals.financial,
    human: capitals.human,
    social: capitals.social,
    business: capitals.business,
    legacy: capitals.legacy,
  };

  return (
    <Card className="border-[#2EC4B6]/20 shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-[#1C2541] mb-4">Five Capitals</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FIVE_CAPITALS.map((capital) => (
            <div key={capital.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#1C2541]">{capital.label}</span>
                <span className="text-xs text-gray-500">{scores[capital.key]}%</span>
              </div>
              <Progress value={scores[capital.key]} className={`h-2 ${SCORE_COLORS[capital.key]}`} />
              <p className="text-[11px] leading-snug text-gray-500">{labels[capital.key]}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
