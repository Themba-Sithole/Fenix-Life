import { useEffect, useState } from 'react';
import { Activity, Database, Server, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchHealth, fetchMetrics, type DashboardMetrics } from '@/lib/admin-api';

export default function DashboardScreen() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [health, setHealth] = useState<{ database: string; redis: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchMetrics(), fetchHealth()])
      .then(([m, h]) => {
        setMetrics(m);
        setHealth(h);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard'));
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Operations Dashboard</h1>
        <p className="text-slate-400 text-sm">Platform health and activity overview</p>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard icon={Server} label="API Status" value={metrics?.apiStatus ?? '…'} />
        <MetricCard icon={Users} label="Total Accounts" value={String(metrics?.userCount ?? '…')} />
        <MetricCard icon={Activity} label="Active Saves (24h)" value={String(metrics?.activePlayers24h ?? '…')} />
        <MetricCard icon={AlertTriangle} label="Pending Moderation" value={String(metrics?.pendingModeration ?? '…')} accent="warning" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-[#2EC4B6]/20 bg-[#1C2541]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-[#2EC4B6]" />
              Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Database" value={health?.database ?? '…'} />
            <Row label="Redis" value={health?.redis ?? '…'} />
            <Row label="Save errors (24h)" value={String(metrics?.saveErrors24h ?? 0)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: 'warning';
}) {
  return (
    <Card className="border-[#2EC4B6]/20 bg-[#1C2541]">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
            <p className="text-2xl font-semibold text-white mt-1">{value}</p>
          </div>
          <Icon className={`w-8 h-8 ${accent === 'warning' ? 'text-[#F4B400]' : 'text-[#2EC4B6]'}`} />
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/5 pb-2">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}
