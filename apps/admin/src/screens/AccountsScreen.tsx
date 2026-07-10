import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  fetchAccount,
  inspectSave,
  searchAccounts,
  suspendAccount,
  type AccountSummary,
} from '@/lib/admin-api';

export default function AccountsScreen() {
  const { accountId } = useParams();
  const [query, setQuery] = useState('');
  const [accounts, setAccounts] = useState<AccountSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    searchAccounts(query)
      .then(setAccounts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Search failed'))
      .finally(() => setLoading(false));
  }, [query]);

  if (accountId) {
    return <AccountDetail accountId={accountId} />;
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Accounts</h1>
        <p className="text-slate-400 text-sm">Search player and staff accounts</p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          className="pl-10"
          placeholder="Search by email, name, or ID…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <ErrorBox message={error} />}

      <Card className="border-[#2EC4B6]/20 bg-[#1C2541]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Saves</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {!loading && accounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                    No accounts found
                  </TableCell>
                </TableRow>
              )}
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <Link to={`/accounts/${account.id}`} className="text-[#2EC4B6] hover:underline">
                      {account.email}
                    </Link>
                  </TableCell>
                  <TableCell>{account.displayName ?? '—'}</TableCell>
                  <TableCell>{account.role}</TableCell>
                  <TableCell>
                    <Badge variant={account.suspended ? 'destructive' : 'secondary'}>
                      {account.suspended ? 'Suspended' : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell>{account.saveCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AccountDetail({ accountId }: { accountId: string }) {
  const [account, setAccount] = useState<Awaited<ReturnType<typeof fetchAccount>>['account'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAccount(accountId)
      .then((data) => setAccount(data.account))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load account'));
  }, [accountId]);

  async function toggleSuspend() {
    if (!account) return;
    const confirmText = account.suspended ? 'unsuspend' : 'suspend';
    if (!window.confirm(`Confirm you want to ${confirmText} ${account.email}?`)) return;

    setActionLoading(true);
    try {
      const result = await suspendAccount(account.id, !account.suspended);
      setAccount((prev) => (prev ? { ...prev, suspended: result.account.suspended } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  }

  if (!account && !error) {
    return <div className="p-8 text-slate-400">Loading account…</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link to="/accounts" className="text-sm text-[#2EC4B6] hover:underline">
            ← Back to accounts
          </Link>
          <h1 className="text-2xl font-semibold text-white mt-2">{account?.email}</h1>
          <p className="text-slate-400 text-sm">{account?.id}</p>
        </div>
        {account && (
          <Button
            variant={account.suspended ? 'outline' : 'destructive'}
            disabled={actionLoading}
            onClick={toggleSuspend}
          >
            {account.suspended ? 'Unsuspend Account' : 'Suspend Account'}
          </Button>
        )}
      </div>

      {error && <ErrorBox message={error} />}

      {account && (
        <>
          <Card className="border-[#2EC4B6]/20 bg-[#1C2541]">
            <CardHeader>
              <CardTitle className="text-white">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
              <Detail label="Display name" value={account.displayName ?? '—'} />
              <Detail label="Role" value={account.role} />
              <Detail label="Status" value={account.suspended ? 'Suspended' : 'Active'} />
              <Detail label="Created" value={new Date(account.createdAt).toLocaleString()} />
            </CardContent>
          </Card>

          <Card className="border-[#2EC4B6]/20 bg-[#1C2541]">
            <CardHeader>
              <CardTitle className="text-white">Saves</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Schema</TableHead>
                    <TableHead>Blob Size</TableHead>
                    <TableHead>Last Played</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {account.saves.map((save) => (
                    <TableRow key={save.id}>
                      <TableCell>
                        <Link to={`/saves/${save.id}`} className="text-[#2EC4B6] hover:underline">
                          {save.name}
                        </Link>
                      </TableCell>
                      <TableCell>v{save.schemaVersion}</TableCell>
                      <TableCell>{save.blobSizeBytes ? `${save.blobSizeBytes} B` : '—'}</TableCell>
                      <TableCell>{new Date(save.lastPlayedAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export function SaveInspectScreen() {
  const { saveId } = useParams();
  const [data, setData] = useState<Awaited<ReturnType<typeof inspectSave>>['save'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!saveId) return;
    inspectSave(saveId)
      .then((result) => setData(result.save))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to inspect save'));
  }, [saveId]);

  return (
    <div className="p-8 space-y-6">
      <div>
        <Link to="/accounts" className="text-sm text-[#2EC4B6] hover:underline">
          ← Accounts
        </Link>
        <h1 className="text-2xl font-semibold text-white mt-2">Save Inspector</h1>
        <p className="text-slate-400 text-sm font-mono">{saveId}</p>
      </div>

      {error && <ErrorBox message={error} />}
      {!data && !error && <p className="text-slate-400">Loading save metadata…</p>}

      {data && (
        <Card className="border-[#2EC4B6]/20 bg-[#1C2541]">
          <CardHeader>
            <CardTitle className="text-white">{data.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
            <Detail label="Owner" value={data.owner.email} />
            <Detail label="Schema version" value={`v${data.schemaVersion}`} />
            <Detail label="World seed" value={data.worldSeed ?? '—'} />
            <Detail label="Has blob" value={data.hasBlob ? 'Yes' : 'No'} />
            <Detail label="Blob size" value={data.blobSizeBytes ? `${data.blobSizeBytes} bytes` : '—'} />
            <Detail label="Blob checksum" value={data.blobChecksum ?? '—'} />
            <Detail label="Blob updated" value={data.blobUpdatedAt ? new Date(data.blobUpdatedAt).toLocaleString() : '—'} />
            <Detail label="Last played" value={new Date(data.lastPlayedAt).toLocaleString()} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-slate-400 text-xs uppercase tracking-wide">{label}</div>
      <div className="text-white mt-1 break-all">{value}</div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
      {message}
    </div>
  );
}
