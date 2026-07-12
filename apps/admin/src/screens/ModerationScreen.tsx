import { useCallback, useEffect, useState } from 'react';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';
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
import {
  fetchModerationQueue,
  resolveModerationItem,
  escalateModerationItem,
  type ModerationItem,
} from '@/lib/admin-api';

function statusBadge(status: ModerationItem['status']) {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-600/30">Pending</Badge>;
    case 'escalated':
      return <Badge className="bg-red-600/20 text-red-300 border-red-600/30">Escalated</Badge>;
    case 'resolved':
      return <Badge className="bg-green-600/20 text-green-300 border-green-600/30">Resolved</Badge>;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function typeBadge(type: ModerationItem['type']) {
  const labels: Record<ModerationItem['type'], string> = {
    display_name: 'Display Name',
    company_name: 'Company Name',
    chat_message: 'Chat Message',
    save_content: 'Save Content',
  };
  return <Badge variant="outline" className="text-slate-300">{labels[type]}</Badge>;
}

export default function ModerationScreen() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    fetchModerationQueue()
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load queue'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  async function handleResolve(itemId: string) {
    try {
      const resolved = await resolveModerationItem(itemId);
      setItems((prev) => prev.map((i) => (i.id === resolved.id ? resolved : i)));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed');
    }
  }

  async function handleEscalate(itemId: string) {
    try {
      const escalated = await escalateModerationItem(itemId);
      setItems((prev) => prev.map((i) => (i.id === escalated.id ? escalated : i)));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed');
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#2EC4B6]" />
            Moderation Queue
          </h1>
          <p className="text-slate-400 text-sm">Review and action flagged content</p>
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
      {actionError && (
        <div className="rounded-md border border-orange-500/40 bg-orange-950/40 px-3 py-2 text-sm text-orange-200">
          {actionError}
        </div>
      )}

      <Card className="border-slate-700 bg-[#0B132B]">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading moderation queue…</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <span>No items in queue</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-400">Type</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Content</TableHead>
                  <TableHead className="text-slate-400">Reason</TableHead>
                  <TableHead className="text-slate-400">Reported</TableHead>
                  <TableHead className="text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="border-slate-700 hover:bg-slate-800/30">
                    <TableCell>{typeBadge(item.type)}</TableCell>
                    <TableCell>{statusBadge(item.status)}</TableCell>
                    <TableCell className="max-w-xs truncate text-slate-200 font-mono text-xs">
                      {item.reportedContent}
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm max-w-xs truncate">
                      {item.reason}
                    </TableCell>
                    <TableCell className="text-slate-400 text-xs whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status !== 'resolved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-400 border-green-700 hover:bg-green-900/20"
                            onClick={() => handleResolve(item.id)}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolve
                          </Button>
                        )}
                        {item.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-400 border-red-700 hover:bg-red-900/20"
                            onClick={() => handleEscalate(item.id)}
                          >
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Escalate
                          </Button>
                        )}
                      </div>
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
