import { useState } from 'react';
import { Outlet } from 'react-router';
import { AuthProvider } from '@/context/AuthContext';
import { SaveProvider } from '@/context/SaveContext';
import { SimulationProvider, useSimulation } from '@/context/SimulationContext';
import { HomeTourOverlay } from '../components/HomeTourOverlay';
import { Toaster } from '../components/ui/sonner';

function OfflineSaveBanner() {
  const { isPlayingOffline, isSaving, syncNow } = useSimulation();
  const [syncError, setSyncError] = useState<string | null>(null);

  if (!isPlayingOffline) return null;

  async function handleSync() {
    setSyncError(null);
    const ok = await syncNow();
    if (!ok) {
      setSyncError('Sync failed — still offline.');
    }
  }

  return (
    <div className="sticky top-0 z-50 bg-accent text-accent-foreground text-center text-sm py-2 px-4 shadow-md flex flex-wrap items-center justify-center gap-3">
      <span>
        Playing offline — progress is saved locally
        {syncError ? ` · ${syncError}` : ''}
      </span>
      <button
        type="button"
        className="underline font-medium disabled:opacity-60"
        disabled={isSaving}
        onClick={() => {
          handleSync().catch(console.error);
        }}
      >
        {isSaving ? 'Syncing…' : 'Sync now'}
      </button>
    </div>
  );
}

function AppShell() {
  return (
    <>
      <OfflineSaveBanner />
      <Outlet />
      <HomeTourOverlay />
      <Toaster />
    </>
  );
}

export function RootLayout() {
  return (
    <AuthProvider>
      <SaveProvider>
        <SimulationProvider>
          <AppShell />
        </SimulationProvider>
      </SaveProvider>
    </AuthProvider>
  );
}
