export const motionDurations = {
  fast: 0.15,
  base: 0.22,
  slow: 0.32,
} as const;

export const motionEase = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: motionDurations.base, ease: motionEase },
};

export const staggerChildren = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

export const reducedMotionSafe = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.01 },
};

export function preferReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
