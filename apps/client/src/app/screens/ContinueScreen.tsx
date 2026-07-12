import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Calendar, Pencil, Play, Trash2, User } from 'lucide-react';
import { formatSaveDate, useSave } from '@/context/SaveContext';
import { getCitiesForCountry, parseWorldSeed } from '@fenix/domain';

export default function ContinueScreen() {
  const navigate = useNavigate();
  const { saves, isLoading, selectSave, refreshSaves, deleteSaveById, renameSaveById } = useSave();
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    refreshSaves().catch(() => setError('Could not load saves'));
  }, [refreshSaves]);

  async function handleContinue(saveId: string) {
    setError(null);
    setLoadingId(saveId);
    try {
      await selectSave(saveId);
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load save');
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(saveId: string, saveName: string) {
    const confirmed = window.confirm(`Delete "${saveName}" permanently?`);
    if (!confirmed) {
      return;
    }

    setError(null);
    setLoadingId(saveId);
    try {
      await deleteSaveById(saveId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete save');
    } finally {
      setLoadingId(null);
    }
  }

  async function handleRename(saveId: string) {
    const trimmed = renameValue.trim();
    if (!trimmed) {
      return;
    }

    setError(null);
    setLoadingId(saveId);
    try {
      await renameSaveById(saveId, trimmed);
      setRenamingId(null);
      setRenameValue('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not rename save');
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-brand-atmosphere px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <Button
          variant="ghost"
          className="mb-10 text-white/70 hover:bg-white/10 hover:text-white"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>

        <section className="border-y border-white/15 py-8">
          <p className="text-xs font-medium tracking-[0.16em] text-fenix-gold">YOUR STORIES</p>
          <h1 className="mt-2 font-display text-3xl">Continue a life</h1>
          <p className="mt-2 text-sm text-white/65">Pick up where a past decision left off.</p>
          <div className="mt-8 space-y-3">
            {error ? (
              <div role="alert" className="rounded-md border border-destructive/60 bg-destructive/15 px-3 py-2 text-sm text-white">
                {error}
              </div>
            ) : null}

            {isLoading && saves.length === 0 && (
              <p className="py-8 text-center text-white/65">Loading your lives…</p>
            )}

            {!isLoading && saves.length === 0 && (
              <div className="space-y-4 py-8 text-center">
                <p className="text-white/65">No saved lives yet.</p>
                <Button
                  onClick={() => navigate('/character-creation')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start New Life
                </Button>
              </div>
            )}

            {saves.map((save) => (
              <div key={save.id} className="border-b border-white/15 py-5 first:border-t">
                {renamingId === save.id ? (
                  <div className="flex flex-col gap-3">
                    <Input
                      value={renameValue}
                      onChange={(event) => setRenameValue(event.target.value)}
                      className="border-white/25 bg-white/10 text-white"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground"
                        onClick={() => handleRename(save.id)}
                        disabled={loadingId !== null}
                      >
                        Save Name
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRenamingId(null);
                          setRenameValue('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => handleContinue(save.id)}
                      disabled={loadingId !== null}
                      className="flex-1 text-left disabled:opacity-60"
                    >
                      <div className="flex items-center gap-2 font-medium text-white">
                        <User className="w-4 h-4 text-fenix-emerald" />
                        {save.name}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60">
                        <span>{getSaveStoryMeta(save.worldSeed)}</span>
                        <Calendar className="w-3 h-3" />
                        <span>Last played {formatSaveDate(save.lastPlayedAt)}</span>
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white/65 hover:text-white"
                        disabled={loadingId !== null}
                        onClick={() => {
                          setRenamingId(save.id);
                          setRenameValue(save.name);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive/80"
                        disabled={loadingId !== null}
                        onClick={() => handleDelete(save.id, save.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={loadingId !== null}
                        onClick={() => handleContinue(save.id)}
                      >
                        {loadingId === save.id ? 'Loading…' : 'Continue'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function getSaveStoryMeta(worldSeed: string | null): string {
  const seed = parseWorldSeed(worldSeed);
  const city = getCitiesForCountry(seed.origin.countryCode).find((item) => item.id === seed.origin.cityId);
  return city ? `Age 18 · ${city.name} · Net worth awaits` : "Age 18 · New beginnings";
}
