import { useCallback, useEffect, useState } from 'react';
import { Flag, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchFeatureFlags, updateFeatureFlag, type FeatureFlag } from '@/lib/admin-api';

export default function FeatureFlagsScreen() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    fetchFeatureFlags()
      .then(setFlags)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load feature flags'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  async function handleToggle(flag: FeatureFlag) {
    setToggling(flag.key);
    try {
      const updated = await updateFeatureFlag(flag.key, { enabled: !flag.enabled });
      setFlags((prev) => prev.map((f) => (f.key === updated.key ? updated : f)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Toggle failed');
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Flag className="w-6 h-6 text-[#2EC4B6]" />
            Feature Flags
          </h1>
          <p className="text-slate-400 text-sm">Control feature rollout without a deploy</p>
        </div>
        <Button size="sm" variant="outline" onClick={reload} disabled={loading}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <Card className="border-slate-700 bg-[#0B132B]">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading feature flags…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-400">Key</TableHead>
                  <TableHead className="text-slate-400">Label</TableHead>
                  <TableHead className="text-slate-400">Description</TableHead>
                  <TableHead className="text-slate-400">Rollout</TableHead>
                  <TableHead className="text-slate-400">Updated</TableHead>
                  <TableHead className="text-slate-400 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flags.map((flag) => (
                  <TableRow key={flag.key} className="border-slate-700 hover:bg-slate-800/30">
                    <TableCell className="font-mono text-xs text-slate-300">{flag.key}</TableCell>
                    <TableCell className="text-slate-200 font-medium">{flag.label}</TableCell>
                    <TableCell className="text-slate-400 text-sm max-w-xs">{flag.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          flag.enabledForPercent === 100
                            ? 'text-green-300 border-green-700'
                            : flag.enabledForPercent === 0
                              ? 'text-slate-400 border-slate-600'
                              : 'text-yellow-300 border-yellow-700'
                        }
                      >
                        {flag.enabledForPercent}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-xs whitespace-nowrap">
                      {new Date(flag.updatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={toggling === flag.key}
                        onClick={() => handleToggle(flag)}
                        className={flag.enabled ? 'text-[#2EC4B6] hover:text-[#2EC4B6]' : 'text-slate-500'}
                      >
                        {flag.enabled ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                        <span className="ml-1">{flag.enabled ? 'On' : 'Off'}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
