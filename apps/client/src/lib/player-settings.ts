export type GraphicsQuality = 'low' | 'medium' | 'high' | 'ultra';
export type Difficulty = 'easy' | 'normal' | 'hard' | 'expert';

export interface PlayerSettings {
  graphicsQuality: GraphicsQuality;
  fullscreen: boolean;
  vSync: boolean;
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  difficulty: Difficulty;
  autosave: boolean;
  tutorialHints: boolean;
  language: string;
  notifications: boolean;
  cloudSaves: boolean;
}

export const PLAYER_SETTINGS_KEY = 'fenix_player_settings';

export const DEFAULT_PLAYER_SETTINGS: PlayerSettings = {
  graphicsQuality: 'high',
  fullscreen: true,
  vSync: false,
  masterVolume: 80,
  musicVolume: 60,
  effectsVolume: 70,
  difficulty: 'normal',
  autosave: true,
  tutorialHints: true,
  language: 'en',
  notifications: true,
  cloudSaves: true,
};

function isGraphicsQuality(value: unknown): value is GraphicsQuality {
  return value === 'low' || value === 'medium' || value === 'high' || value === 'ultra';
}

function isDifficulty(value: unknown): value is Difficulty {
  return value === 'easy' || value === 'normal' || value === 'hard' || value === 'expert';
}

function clampPercent(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function loadPlayerSettings(): PlayerSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_PLAYER_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(PLAYER_SETTINGS_KEY);
    if (!raw) {
      return DEFAULT_PLAYER_SETTINGS;
    }

    const parsed = JSON.parse(raw) as Partial<PlayerSettings>;
    return {
      graphicsQuality: isGraphicsQuality(parsed.graphicsQuality)
        ? parsed.graphicsQuality
        : DEFAULT_PLAYER_SETTINGS.graphicsQuality,
      fullscreen: parsed.fullscreen ?? DEFAULT_PLAYER_SETTINGS.fullscreen,
      vSync: parsed.vSync ?? DEFAULT_PLAYER_SETTINGS.vSync,
      masterVolume: clampPercent(parsed.masterVolume, DEFAULT_PLAYER_SETTINGS.masterVolume),
      musicVolume: clampPercent(parsed.musicVolume, DEFAULT_PLAYER_SETTINGS.musicVolume),
      effectsVolume: clampPercent(parsed.effectsVolume, DEFAULT_PLAYER_SETTINGS.effectsVolume),
      difficulty: isDifficulty(parsed.difficulty)
        ? parsed.difficulty
        : DEFAULT_PLAYER_SETTINGS.difficulty,
      autosave: parsed.autosave ?? DEFAULT_PLAYER_SETTINGS.autosave,
      tutorialHints: parsed.tutorialHints ?? DEFAULT_PLAYER_SETTINGS.tutorialHints,
      language: typeof parsed.language === 'string' ? parsed.language : DEFAULT_PLAYER_SETTINGS.language,
      notifications: parsed.notifications ?? DEFAULT_PLAYER_SETTINGS.notifications,
      cloudSaves: parsed.cloudSaves ?? DEFAULT_PLAYER_SETTINGS.cloudSaves,
    };
  } catch {
    return DEFAULT_PLAYER_SETTINGS;
  }
}

export function savePlayerSettings(settings: PlayerSettings): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(PLAYER_SETTINGS_KEY, JSON.stringify(settings));
}

export function isAutosaveEnabled(): boolean {
  return loadPlayerSettings().autosave;
}
