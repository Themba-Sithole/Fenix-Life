import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Calendar, Play, User } from 'lucide-react';
import { formatSaveDate, useSave } from '@/context/SaveContext';

export default function ContinueScreen() {
  const navigate = useNavigate();
  const { saves, isLoading, selectSave, refreshSaves } = useSave();
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#0B132B] p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-[#2EC4B6] hover:text-white hover:bg-white/10"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>

        <Card className="bg-[#1C2541]/90 border-[#2EC4B6]/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Continue Your Life</CardTitle>
            <p className="text-gray-300">Select a save to resume</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md border border-red-400/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            {isLoading && saves.length === 0 && (
              <p className="text-gray-300 text-center py-8">Loading saves…</p>
            )}

            {!isLoading && saves.length === 0 && (
              <div className="text-center py-8 space-y-4">
                <p className="text-gray-300">No saved lives yet.</p>
                <Button
                  onClick={() => navigate('/character-creation')}
                  className="bg-gradient-to-r from-[#2EC4B6] to-[#1C9B8F] text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start New Life
                </Button>
              </div>
            )}

            {saves.map((save) => (
              <button
                key={save.id}
                type="button"
                onClick={() => handleContinue(save.id)}
                disabled={loadingId !== null}
                className="w-full text-left rounded-lg border border-[#2EC4B6]/20 bg-[#0B132B]/40 p-4 hover:border-[#2EC4B6]/50 hover:bg-[#0B132B]/60 transition-colors disabled:opacity-60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <User className="w-4 h-4 text-[#2EC4B6]" />
                      {save.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                      <Calendar className="w-3 h-3" />
                      Last played {formatSaveDate(save.lastPlayedAt)}
                    </div>
                  </div>
                  <span className="text-xs text-[#F4B400] whitespace-nowrap">
                    {loadingId === save.id ? 'Loading…' : 'Continue'}
                  </span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
