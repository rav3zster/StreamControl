import { useEffect, useState, useSyncExternalStore } from "react";
import { store, remainingOf, type SceneId, type TimerKey, type SceneConfig } from "./broadcastStore";

// ============================================================================
// React bindings for the shared broadcast store.
// ============================================================================

export function useBroadcastState() {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

// Per-scene configuration (widgets/content/social/appearance/animations).
export function useSceneConfig(scene: SceneId): SceneConfig {
  return useBroadcastState().scenes[scene];
}

// Ticking clock used to derive live countdowns from the store's endsAt.
export function useNow(intervalMs = 250) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

// Same shape the TimerController + scenes already expect.
export type BroadcastTimer = ReturnType<typeof useTimer>;

export function useTimer(key: TimerKey) {
  const state = useBroadcastState();
  const now = useNow(250);
  const t = state.timers[key];
  const remaining = remainingOf(t, now);

  // Whichever tab notices zero-while-running triggers completion (idempotent).
  useEffect(() => {
    if (t.running && remaining <= 0) store.timerComplete(key);
  }, [t.running, remaining, key]);

  return {
    remaining,
    target: t.target,
    running: t.running,
    autoSwitch: t.autoSwitch,
    m: String(Math.floor(remaining / 60)).padStart(2, "0"),
    s: String(remaining % 60).padStart(2, "0"),
    start: () => store.timerStart(key),
    pause: () => store.timerPause(key),
    reset: () => store.timerReset(key),
    adjust: (d: number) => store.timerAdjust(key, d),
    setDuration: (seconds: number) => store.timerSetDuration(key, seconds),
    setAutoSwitch: (v: boolean) => store.timerSetAutoSwitch(key, v),
  };
}

// --- scene <-> URL slug mapping ---------------------------------------------
export const SCENE_LIST: { id: SceneId; slug: string; index: string; label: string }[] = [
  { id: "starting", slug: "starting-soon", index: "01", label: "Starting Soon" },
  { id: "live", slug: "gameplay", index: "02", label: "Live Gameplay" },
  { id: "chatting", slug: "chatting", index: "03", label: "Just Chatting" },
  { id: "brb", slug: "brb", index: "04", label: "Be Right Back" },
  { id: "ending", slug: "ending", index: "05", label: "Stream Ending" },
];

export const slugToScene = (slug?: string): SceneId | null =>
  SCENE_LIST.find((s) => s.slug === slug)?.id ?? null;

export const sceneToSlug = (id: SceneId): string =>
  SCENE_LIST.find((s) => s.id === id)!.slug;

// --- Moveable layout & logo hooks -------------------------------------------
export function useLayoutEditMode(): boolean {
  return useBroadcastState().layoutEditMode;
}

export function useSnapEnabled(): boolean {
  return useBroadcastState().snapEnabled;
}

export function useWidgetPositions(scene: SceneId) {
  return useBroadcastState().widgetPositions[scene] ?? {};
}

export function useWidgetPosition(scene: SceneId, widgetKey: string) {
  const positions = useWidgetPositions(scene);
  return positions[widgetKey] ?? { x: 0, y: 0 };
}

export function useCustomLogo() {
  const state = useBroadcastState();
  return {
    customLogo: state.customLogo,
    customLogoIcon: state.customLogoIcon,
  };
}
