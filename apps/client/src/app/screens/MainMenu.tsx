import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Play, Settings, Trophy } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSave } from "@/context/SaveContext";
import { buildMarketTickerItems, createDefaultEconomy, ensureWorldV2 } from "@fenix/domain";
import { readOfflineSave } from "@/lib/offline-save";
import { parseSaveBlobV1 } from "@fenix/simulation-engine";
import {
  fadeUp,
  FenixLogo,
  motionDurations,
  preferReducedMotion,
  reducedMotionSafe,
} from "../components/shell";

const SKYLINE = [30, 45, 38, 58, 42, 50, 35, 62, 47, 40, 55, 33];

export default function MainMenu() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { activeSave } = useSave();

  const newsItems = useMemo(() => {
    if (!activeSave) {
      return buildMarketTickerItems();
    }
    try {
      const raw = readOfflineSave(activeSave.id);
      if (!raw) {
        return buildMarketTickerItems();
      }
      const blob = parseSaveBlobV1(raw);
      const world = ensureWorldV2(blob.world, activeSave.name);
      return buildMarketTickerItems(world.economy, world.events.slice(0, 4));
    } catch {
      return buildMarketTickerItems(createDefaultEconomy());
    }
  }, [activeSave]);

  function requireAuth(path: string) {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: path } });
      return;
    }
    navigate(path);
  }

  const reducedMotion = preferReducedMotion();
  const enterAnimation = reducedMotion ? reducedMotionSafe : fadeUp;

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-atmosphere text-white">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[35vh] items-end justify-center gap-1 px-3 opacity-80">
        {SKYLINE.map((height, index) => (
          <motion.div
            key={height}
            className="relative flex-1 border-x border-fenix-emerald/20 bg-gradient-to-b from-fenix-blue to-fenix-navy"
            style={{ height: `${height}%` }}
            initial={reducedMotion ? false : { opacity: 0, y: 32 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: motionDurations.slow, delay: index * 0.035 }}
          >
            <div className="grid grid-cols-2 gap-2 p-2 opacity-60">
              {Array.from({ length: Math.max(2, Math.floor(height / 10)) }, (_, windowIndex) => (
                <span key={windowIndex} className="h-1.5 bg-fenix-gold" />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div {...enterAnimation}>
          <FenixLogo variant="stacked" tone="light" className="mb-5" />
          <p className="text-base text-white/70">Every decision becomes your story.</p>
        </motion.div>
        <motion.div
          {...enterAnimation}
          transition={{ duration: motionDurations.base, delay: reducedMotion ? 0 : 0.12 }}
          className="mt-10 grid w-full gap-3 sm:grid-cols-2"
        >
          <Button
            onClick={() => requireAuth("/character-creation")}
            className="h-14 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Play className="w-5 h-5 mr-2" />
            New Life
          </Button>
          <Button
            onClick={() => requireAuth("/continue")}
            className="h-14 border-white/25 bg-white/5 text-white hover:bg-white/10"
            variant="outline"
          >
            Continue
          </Button>
          <Button
            onClick={() => requireAuth("/settings")}
            className="h-12 border-white/15 bg-transparent text-white/75 hover:bg-white/10 hover:text-white"
            variant="outline"
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Button>
          <Button
            onClick={() => requireAuth("/timeline")}
            className="h-12 border-white/15 bg-transparent text-white/75 hover:bg-white/10 hover:text-white"
            variant="outline"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Life Timeline
          </Button>
        </motion.div>
        <motion.div
          {...enterAnimation}
          transition={{ duration: motionDurations.base, delay: reducedMotion ? 0 : 0.2 }}
          className="mt-10 w-full border-y border-white/15 py-3 text-left text-sm"
          aria-label="World ticker"
        >
          <p className="mb-1 text-[11px] font-medium tracking-[0.16em] text-fenix-gold">THE WORLD MOVES</p>
          <p className="text-white/75">
            {activeSave
              ? `${activeSave.name}: ${newsItems[0]?.text ?? "Your next chapter is waiting."}`
              : "No life in progress — start a new story when you are ready."}
          </p>
        </motion.div>
        <p className="mt-6 text-xs text-white/45">
          {isAuthenticated ? `Signed in as ${user?.displayName ?? user?.email}` : "Guest mode"}
        </p>
      </div>
    </main>
  );
}