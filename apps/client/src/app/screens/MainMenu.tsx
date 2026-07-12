import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { TrendingUp, Building2, User, Play, Settings, Trophy, Users, Award } from "lucide-react";
import React, { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSave } from "@/context/SaveContext";
import { buildMarketTickerItems, createDefaultEconomy, ensureWorldV2 } from "@fenix/domain";
import { readOfflineSave } from "@/lib/offline-save";
import { parseSaveBlobV1 } from "@fenix/simulation-engine";

export default function MainMenu() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { saves, activeSave } = useSave();

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

  const recentLifeLabel = activeSave?.name ?? (saves[0]?.name ?? "None yet");

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#0B132B]">
      {/* Animated City Skyline Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* City Buildings */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-2 px-4">
          {[120, 180, 150, 200, 160, 140, 190, 170, 130, 180, 160, 140, 200, 150, 170].map((height, i) => (
            <motion.div
              key={i}
              className="relative bg-gradient-to-b from-[#1C2541] to-[#0B132B] border border-[#2EC4B6]/20"
              style={{
                width: `${60 + Math.random() * 40}px`,
                height: `${height}px`,
              }}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              {/* Building Windows */}
              <div className="grid grid-cols-3 gap-1 p-2">
                {[...Array(Math.floor(height / 20))].map((_, windowRow) => (
                  <React.Fragment key={windowRow}>
                    {[...Array(3)].map((_, windowCol) => (
                      <motion.div
                        key={`${windowRow}-${windowCol}`}
                        className="w-2 h-2 bg-[#F4B400]"
                        animate={{
                          opacity: [0.3, 0.9, 0.3],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>
              {/* Building Top Light */}
              <motion.div
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#2EC4B6] rounded-full blur-sm"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Moving Cars */}
        <div className="absolute bottom-8 left-0 right-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-3 bg-[#F4B400] rounded-sm"
              style={{
                bottom: `${i * 4}px`,
              }}
              animate={{
                x: [-100, window.innerWidth + 100],
              }}
              transition={{
                duration: 15 + i * 5,
                repeat: Infinity,
                delay: i * 3,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Logo/Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-[#2EC4B6] via-[#F4B400] to-[#2EC4B6] bg-clip-text text-transparent">
            FENIX LIFE
          </h1>
          <p className="text-xl text-[#2EC4B6]/80">Build Your Empire. Live Your Legacy.</p>
        </motion.div>

        {/* Player Profile Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-[#1C2541]/90 border-[#2EC4B6]/30 backdrop-blur-sm">
            <CardContent className="p-6 grid grid-cols-3 gap-6 text-white">
              <div className="text-center">
                <User className="w-6 h-6 mx-auto mb-2 text-[#2EC4B6]" />
                <div className="text-sm text-gray-400">Account</div>
                <div>{isAuthenticated ? (user?.displayName ?? user?.email) : "Guest"}</div>
              </div>
              <div className="text-center">
                <Building2 className="w-6 h-6 mx-auto mb-2 text-[#F4B400]" />
                <div className="text-sm text-gray-400">Saved Lives</div>
                <div className="text-[#2EC4B6]">{isAuthenticated ? saves.length : "—"}</div>
              </div>
              <div className="text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-[#2EC4B6]" />
                <div className="text-sm text-gray-400">Recent Life</div>
                <div className="text-sm truncate max-w-[140px]">{isAuthenticated ? recentLifeLabel : "—"}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Menu Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid grid-cols-2 gap-4 mb-8 w-full max-w-md"
        >
          <Button
            onClick={() => requireAuth("/character-creation")}
            className="h-14 bg-gradient-to-r from-[#2EC4B6] to-[#1C9B8F] hover:from-[#1C9B8F] hover:to-[#2EC4B6] text-white shadow-lg shadow-[#2EC4B6]/20"
          >
            <Play className="w-5 h-5 mr-2" />
            New Life
          </Button>
          <Button
            onClick={() => requireAuth("/continue")}
            className="h-14 bg-gradient-to-r from-[#1C2541] to-[#0B132B] hover:from-[#0B132B] hover:to-[#1C2541] text-white border border-[#2EC4B6]/30"
            variant="outline"
          >
            Continue
          </Button>
          <Button
            disabled
            title="Coming in a future update"
            className="h-14 bg-[#1C2541]/80 text-white/60 border border-[#2EC4B6]/20 cursor-not-allowed"
            variant="outline"
          >
            <Users className="w-5 h-5 mr-2" />
            Multiplayer (Soon)
          </Button>
          <Button
            onClick={() => requireAuth("/settings")}
            className="h-14 bg-[#1C2541]/80 hover:bg-[#1C2541] text-white border border-[#2EC4B6]/20"
            variant="outline"
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Button>
          <Button
            onClick={() => requireAuth("/timeline")}
            className="h-14 bg-[#1C2541]/80 hover:bg-[#1C2541] text-white border border-[#2EC4B6]/20"
            variant="outline"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Life Timeline
          </Button>
          <Button
            disabled
            title="Coming in a future update"
            className="h-14 bg-[#1C2541]/80 text-white/60 border border-[#2EC4B6]/20 cursor-not-allowed"
            variant="outline"
          >
            <Award className="w-5 h-5 mr-2" />
            Leaderboards (Soon)
          </Button>
        </motion.div>

        {/* Stock Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-4xl overflow-hidden"
        >
          <Card className="bg-[#1C2541]/70 border-[#F4B400]/30 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-8 text-white">
                <div className="text-sm text-gray-400 whitespace-nowrap">MARKET NEWS:</div>
                <motion.div
                  className="flex gap-8"
                  animate={{ x: [-1000, 0] }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {[...newsItems, ...newsItems].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                      <span className="text-sm">{item.text}</span>
                      <span className={`text-xs ${item.change.startsWith('+') ? 'text-[#2EC4B6]' : 'text-[#F4B400]'}`}>
                        {item.change}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}