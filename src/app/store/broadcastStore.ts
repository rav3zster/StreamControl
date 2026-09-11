// ============================================================================
// broadcastStore — the single source of truth shared between the Editor
// (control room) and every Output/Widget page (broadcast feeds).
//
// State is synced across browser tabs/windows on the same origin via the
// BroadcastChannel API and persisted to localStorage. This is what lets an
// action in the editor (e.g. Pause, toggling a widget) update an OBS Browser
// Source instantly, with no reload — the pattern StreamElements/Streamlabs use.
//
// Timers are stored as an `endsAt` timestamp (not a ticking number) so every
// subscriber derives the identical remaining time locally with zero drift.
//
// Per-scene configuration (widgets, content, socials, appearance) is seeded
// from src/app/store/sceneSchema.ts. Scenes render from this config, so the
// right-hand Configuration Panel drives what viewers see without ever placing
// controls inside the broadcast canvas.
// ============================================================================

import { SCENE_SCHEMA, SOCIAL_PLATFORMS, type RadiusKey } from "./sceneSchema";
import { type ThemeId, THEMES } from "./themes";

export type SceneId = "starting" | "live" | "chatting" | "brb" | "ending";
export type TimerKey = "starting" | "brb";
export type { RadiusKey, ThemeId };

export type TimerState = {
  target: number; // configured duration, seconds
  running: boolean;
  endsAt: number | null; // epoch ms when running; null when paused
  pausedRemaining: number; // seconds left while paused
  autoSwitch: boolean; // jump to gameplay at 00:00
};

export type SceneAppearance = {
  accent: string; // overrides --nc-primary on the scene root
  radius: RadiusKey;
  ambient: boolean; // ambient background effects
  glass: boolean; // glassmorphism on panels
};

export type TextAnimationType = "none" | "marquee" | "pulse" | "shimmer" | "bounce";

export type TextStyleConfig = {
  fontSize?: number; // px
  color?: string; // hex or css color
  fontWeight?: number; // 400, 500, 600, 700, 800, 900
  italic?: boolean;
  uppercase?: boolean;
  animation?: TextAnimationType;
  marqueeSpeed?: number; // seconds per cycle
};

export type SceneConfig = {
  notes: string;
  widgets: Record<string, boolean>;
  content: Record<string, string>;
  contentStyles?: Record<string, TextStyleConfig>;
  social: Record<string, boolean>;
  appearance: SceneAppearance;
  animations: boolean;
};

export type WidgetLayer = "extreme-top" | "top" | "bottom" | "extreme-bottom";

export function layerToZIndex(layer?: WidgetLayer): number {
  switch (layer) {
    case "extreme-top":
      return 50;
    case "top":
      return 35;
    case "bottom":
      return 15;
    case "extreme-bottom":
      return 5;
    default:
      return 25;
  }
}

export type WidgetTransform = {
  x: number;
  y: number;
  w?: number;
  h?: number;
  layer?: WidgetLayer;
};
export type WidgetPosition = WidgetTransform;

export type BroadcastState = {
  activeScene: SceneId;
  activeTheme: ThemeId;
  timers: Record<TimerKey, TimerState>;
  scenes: Record<SceneId, SceneConfig>;
  layoutEditMode: boolean;
  snapEnabled: boolean;
  widgetPositions: Record<SceneId, Record<string, WidgetTransform>>;
  customLogo: string | null;
  customLogoIcon: string | null;
};

const STORAGE_KEY = "axiom-broadcast-state-v2";
const CHANNEL = "axiom-broadcast";
const MAX = 60 * 999;
const clamp = (n: number) => Math.max(0, Math.min(MAX, Math.round(n)));

const SCENE_IDS: SceneId[] = ["starting", "live", "chatting", "brb", "ending"];
// Socials on by default (matches the shipped pack); the rest start disabled.
const DEFAULT_SOCIAL_ON = new Set(["twitch", "youtube", "x", "discord"]);

function makeTimer(seconds: number): TimerState {
  return { target: seconds, running: false, endsAt: null, pausedRemaining: seconds, autoSwitch: true };
}

function defaultPositions(): Record<SceneId, Record<string, WidgetTransform>> {
  return SCENE_IDS.reduce((acc, id) => {
    acc[id] = {};
    return acc;
  }, {} as Record<SceneId, Record<string, WidgetTransform>>);
}

function defaultSceneConfig(scene: SceneId): SceneConfig {
  const schema = SCENE_SCHEMA[scene];
  const widgets: Record<string, boolean> = {};
  schema.widgets.forEach((w) => (widgets[w.key] = true));
  const content: Record<string, string> = {};
  schema.content.forEach((c) => (content[c.key] = ""));
  const social: Record<string, boolean> = {};
  SOCIAL_PLATFORMS.forEach((p) => (social[p.key] = DEFAULT_SOCIAL_ON.has(p.key)));
  return {
    notes: "",
    widgets,
    content,
    contentStyles: {},
    social,
    appearance: { accent: "#4f8cff", radius: "default", ambient: true, glass: true },
    animations: true,
  };
}

function defaultScenes(): Record<SceneId, SceneConfig> {
  return SCENE_IDS.reduce((acc, id) => {
    acc[id] = defaultSceneConfig(id);
    return acc;
  }, {} as Record<SceneId, SceneConfig>);
}

const DEFAULT_STATE: BroadcastState = {
  activeScene: "starting",
  activeTheme: "cyber-esports",
  timers: { starting: makeTimer(600), brb: makeTimer(300) },
  scenes: defaultScenes(),
  layoutEditMode: false,
  snapEnabled: true,
  widgetPositions: defaultPositions(),
  customLogo: null,
  customLogoIcon: null,
};

// --- module state -----------------------------------------------------------
let state: BroadcastState = load();
const listeners = new Set<() => void>();

const channel: BroadcastChannel | null =
  typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL) : null;

// Deep-merge persisted scene config over defaults so newly-added schema keys
// (widgets/content/social/contentStyles) always exist even for older saved state.
function mergeSceneConfig(scene: SceneId, saved: Partial<SceneConfig> | undefined): SceneConfig {
  const base = defaultSceneConfig(scene);
  if (!saved) return base;
  return {
    notes: saved.notes ?? base.notes,
    widgets: { ...base.widgets, ...saved.widgets },
    content: { ...base.content, ...saved.content },
    contentStyles: { ...(saved.contentStyles ?? {}) },
    social: { ...base.social, ...saved.social },
    appearance: { ...base.appearance, ...saved.appearance },
    animations: saved.animations ?? base.animations,
  };
}

function load(): BroadcastState {
  if (typeof localStorage === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    const scenes = SCENE_IDS.reduce((acc, id) => {
      acc[id] = mergeSceneConfig(id, parsed.scenes?.[id]);
      return acc;
    }, {} as Record<SceneId, SceneConfig>);
    const widgetPositions = SCENE_IDS.reduce((acc, id) => {
      acc[id] = { ...(parsed.widgetPositions?.[id] ?? {}) };
      return acc;
    }, {} as Record<SceneId, Record<string, WidgetTransform>>);
    const validTheme = parsed.activeTheme && THEMES[parsed.activeTheme as ThemeId] ? (parsed.activeTheme as ThemeId) : "cyber-esports";
    return {
      activeScene: parsed.activeScene ?? DEFAULT_STATE.activeScene,
      activeTheme: validTheme,
      timers: {
        starting: { ...DEFAULT_STATE.timers.starting, ...parsed.timers?.starting },
        brb: { ...DEFAULT_STATE.timers.brb, ...parsed.timers?.brb },
      },
      scenes,
      layoutEditMode: false,
      snapEnabled: parsed.snapEnabled !== undefined ? Boolean(parsed.snapEnabled) : true,
      widgetPositions,
      customLogo: parsed.customLogo ?? null,
      customLogoIcon: parsed.customLogoIcon ?? null,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function persist() {
  try {
    localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage may be unavailable */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

// Sync with local backend server (bridges Chrome editor <-> OBS Studio CEF)
function syncToServer(stateToSend: BroadcastState) {
  if (typeof window === "undefined") return;
  try {
    // Output feeds and OBS must never receive layoutEditMode: true
    const payload = { ...stateToSend, layoutEditMode: false };
    fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {}
}

// Apply a new state locally + persist + notify. If `broadcast`, also tell peers.
function set(next: BroadcastState, broadcast = true) {
  state = next;
  persist();
  emit();
  if (broadcast) {
    channel?.postMessage(state);
    syncToServer(state);
  }
}

if (channel) {
  channel.onmessage = (e: MessageEvent<BroadcastState>) => {
    // Adopt peer state without re-broadcasting (avoids feedback loops).
    // Always preserve local layoutEditMode so peer updates don't close editor handles!
    state = {
      ...e.data,
      layoutEditMode: state.layoutEditMode,
    };
    persist();
    emit();
  };
}

// Cross-tab fallback for environments without BroadcastChannel.
if (typeof window !== "undefined" && !channel) {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        state = JSON.parse(e.newValue);
        emit();
      } catch {
        /* ignore */
      }
    }
  });
}

// Real-time server sync (bridges Chrome editor <-> OBS Studio CEF browser source)
if (typeof window !== "undefined") {
  // 1. Check if server has active state (e.g. OBS source loading for the first time)
  fetch("/api/state")
    .then((r) => (r.ok ? r.json() : null))
    .then((serverState) => {
      if (serverState && serverState.activeTheme) {
        state = {
          ...DEFAULT_STATE,
          ...serverState,
          layoutEditMode: state.layoutEditMode,
        };
        persist();
        emit();
      } else if (state && state.activeTheme) {
        // If server was clean, seed it with current local state
        syncToServer(state);
      }
    })
    .catch(() => {});

  // 2. Connect to real-time Server-Sent Events stream (OBS CEF receives instant push updates)
  try {
    const sse = new EventSource("/api/state-events");
    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.activeTheme) {
          state = {
            ...DEFAULT_STATE,
            ...data,
            layoutEditMode: state.layoutEditMode,
          };
          persist();
          emit();
        }
      } catch {}
    };
  } catch {}
}

// --- external store interface (useSyncExternalStore) ------------------------
export const store = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  getSnapshot() {
    return state;
  },

  // --- scene actions ---
  setActiveScene(scene: SceneId) {
    if (state.activeScene === scene) return;
    set({ ...state, activeScene: scene });
  },

  // --- scene config actions ---
  sceneSetNotes(scene: SceneId, notes: string) {
    set(patchScene(scene, { notes }));
  },
  sceneSetWidget(scene: SceneId, key: string, on: boolean) {
    const cfg = state.scenes[scene];
    set(patchScene(scene, { widgets: { ...cfg.widgets, [key]: on } }));
  },
  sceneSetContent(scene: SceneId, key: string, value: string) {
    const cfg = state.scenes[scene];
    set(patchScene(scene, { content: { ...cfg.content, [key]: value } }));
  },
  sceneSetContentStyle(scene: SceneId, key: string, style: Partial<TextStyleConfig>) {
    const cfg = state.scenes[scene];
    const prevStyle = cfg.contentStyles?.[key] ?? {};
    set(patchScene(scene, {
      contentStyles: {
        ...(cfg.contentStyles ?? {}),
        [key]: { ...prevStyle, ...style },
      },
    }));
  },
  sceneResetContentStyle(scene: SceneId, key: string) {
    const cfg = state.scenes[scene];
    const styles = { ...(cfg.contentStyles ?? {}) };
    delete styles[key];
    set(patchScene(scene, { contentStyles: styles }));
  },
  sceneSetSocial(scene: SceneId, key: string, on: boolean) {
    const cfg = state.scenes[scene];
    set(patchScene(scene, { social: { ...cfg.social, [key]: on } }));
  },
  sceneSetAppearance(scene: SceneId, partial: Partial<SceneAppearance>) {
    const cfg = state.scenes[scene];
    set(patchScene(scene, { appearance: { ...cfg.appearance, ...partial } }));
  },
  sceneSetAnimations(scene: SceneId, on: boolean) {
    set(patchScene(scene, { animations: on }));
  },

  // --- timer actions ---
  timerStart(key: TimerKey) {
    const t = state.timers[key];
    if (t.running) return;
    const rem = t.pausedRemaining > 0 ? t.pausedRemaining : t.target;
    set(patch(key, { running: true, endsAt: Date.now() + rem * 1000, pausedRemaining: rem }));
  },
  timerPause(key: TimerKey) {
    const t = state.timers[key];
    if (!t.running) return;
    set(patch(key, { running: false, endsAt: null, pausedRemaining: remainingOf(t, Date.now()) }));
  },
  timerReset(key: TimerKey) {
    const t = state.timers[key];
    set(patch(key, { running: false, endsAt: null, pausedRemaining: t.target }));
  },
  timerAdjust(key: TimerKey, deltaSeconds: number) {
    const t = state.timers[key];
    if (t.running && t.endsAt) {
      const rem = clamp(remainingOf(t, Date.now()) + deltaSeconds);
      set(patch(key, { endsAt: Date.now() + rem * 1000 }));
    } else {
      set(patch(key, { pausedRemaining: clamp(t.pausedRemaining + deltaSeconds) }));
    }
  },
  timerSetDuration(key: TimerKey, seconds: number) {
    const v = clamp(seconds);
    set(patch(key, { target: v, pausedRemaining: v, running: false, endsAt: null }));
  },
  timerSetAutoSwitch(key: TimerKey, value: boolean) {
    set(patch(key, { autoSwitch: value }));
  },
  // Fired when a running timer reaches zero.
  timerComplete(key: TimerKey) {
    const t = state.timers[key];
    if (!t.running) return; // already handled by another tab
    const next = patch(key, { running: false, endsAt: null, pausedRemaining: 0 });
    set(t.autoSwitch ? { ...next, activeScene: "live" } : next);
  },

  // --- layout edit & moveable widgets actions ---
  setLayoutEditMode(enabled: boolean) {
    if (state.layoutEditMode === enabled) return;
    set({ ...state, layoutEditMode: enabled }, false);
  },
  toggleLayoutEditMode() {
    set({ ...state, layoutEditMode: !state.layoutEditMode }, false);
  },
  setSnapEnabled(enabled: boolean) {
    if (state.snapEnabled === enabled) return;
    set({ ...state, snapEnabled: enabled }, false);
  },
  toggleSnap() {
    set({ ...state, snapEnabled: !state.snapEnabled }, false);
  },
  setWidgetPosition(scene: SceneId, widgetKey: string, pos: { x: number; y: number }) {
    const scenePositions = { ...(state.widgetPositions[scene] ?? {}) };
    const prev = scenePositions[widgetKey] ?? { x: 0, y: 0 };
    scenePositions[widgetKey] = {
      ...prev,
      x: Math.round(pos.x),
      y: Math.round(pos.y),
    };
    set({
      ...state,
      widgetPositions: {
        ...state.widgetPositions,
        [scene]: scenePositions,
      },
    });
  },
  setWidgetTransform(scene: SceneId, widgetKey: string, transform: Partial<WidgetTransform>) {
    const scenePositions = { ...(state.widgetPositions[scene] ?? {}) };
    const prev = scenePositions[widgetKey] ?? { x: 0, y: 0 };
    scenePositions[widgetKey] = {
      ...prev,
      ...transform,
      x: transform.x !== undefined ? Math.round(transform.x) : prev.x,
      y: transform.y !== undefined ? Math.round(transform.y) : prev.y,
      w: transform.w !== undefined ? Math.round(transform.w) : prev.w,
      h: transform.h !== undefined ? Math.round(transform.h) : prev.h,
    };
    set({
      ...state,
      widgetPositions: {
        ...state.widgetPositions,
        [scene]: scenePositions,
      },
    });
  },
  setWidgetSize(scene: SceneId, widgetKey: string, size: { w?: number; h?: number }) {
    const scenePositions = { ...(state.widgetPositions[scene] ?? {}) };
    const prev = scenePositions[widgetKey] ?? { x: 0, y: 0 };
    scenePositions[widgetKey] = {
      ...prev,
      w: size.w !== undefined ? Math.round(size.w) : prev.w,
      h: size.h !== undefined ? Math.round(size.h) : prev.h,
    };
    set({
      ...state,
      widgetPositions: {
        ...state.widgetPositions,
        [scene]: scenePositions,
      },
    });
  },
  resetWidgetSize(scene: SceneId, widgetKey: string) {
    const scenePositions = { ...(state.widgetPositions[scene] ?? {}) };
    const prev = scenePositions[widgetKey];
    if (prev) {
      const { w, h, ...rest } = prev;
      scenePositions[widgetKey] = rest;
      set({
        ...state,
        widgetPositions: {
          ...state.widgetPositions,
          [scene]: scenePositions,
        },
      });
    }
  },
  setWidgetLayer(scene: SceneId, widgetKey: string, layer: WidgetLayer) {
    const scenePositions = { ...(state.widgetPositions[scene] ?? {}) };
    const prev = scenePositions[widgetKey] ?? { x: 0, y: 0 };
    scenePositions[widgetKey] = {
      ...prev,
      layer,
    };
    set({
      ...state,
      widgetPositions: {
        ...state.widgetPositions,
        [scene]: scenePositions,
      },
    });
  },
  resetWidgetPosition(scene: SceneId, widgetKey: string) {
    const scenePositions = { ...(state.widgetPositions[scene] ?? {}) };
    delete scenePositions[widgetKey];
    set({
      ...state,
      widgetPositions: {
        ...state.widgetPositions,
        [scene]: scenePositions,
      },
    });
  },
  resetSceneLayout(scene: SceneId) {
    set({
      ...state,
      widgetPositions: {
        ...state.widgetPositions,
        [scene]: {},
      },
    });
  },
  resetAllLayouts() {
    set({
      ...state,
      widgetPositions: defaultPositions(),
    });
  },

  // --- theme actions ---
  setTheme(themeId: ThemeId, applyLayoutPreset = false) {
    if (!THEMES[themeId]) return;
    let nextPositions = state.widgetPositions;
    if (applyLayoutPreset) {
      const presets = THEMES[themeId].layoutPresets;
      const merged = { ...state.widgetPositions };
      for (const scene of SCENE_IDS) {
        if (presets[scene]) {
          merged[scene] = { ...presets[scene] };
        }
      }
      nextPositions = merged;
    }
    set({
      ...state,
      activeTheme: themeId,
      widgetPositions: nextPositions,
    });
  },
  applyThemeLayoutPreset(sceneId?: SceneId, themeId?: ThemeId) {
    const targetTheme = themeId ?? state.activeTheme;
    const presets = THEMES[targetTheme]?.layoutPresets;
    if (!presets) return;

    if (sceneId) {
      const scenePreset = presets[sceneId] ?? {};
      set({
        ...state,
        widgetPositions: {
          ...state.widgetPositions,
          [sceneId]: { ...scenePreset },
        },
      });
    } else {
      const merged = { ...state.widgetPositions };
      for (const scene of SCENE_IDS) {
        if (presets[scene]) {
          merged[scene] = { ...presets[scene] };
        }
      }
      set({
        ...state,
        widgetPositions: merged,
      });
    }
  },

  // --- custom logo actions ---
  setCustomLogo(logoDataUrl: string | null) {
    set({ ...state, customLogo: logoDataUrl });
  },
  setCustomLogoIcon(logoIconDataUrl: string | null) {
    set({ ...state, customLogoIcon: logoIconDataUrl });
  },
  resetCustomLogo() {
    set({ ...state, customLogo: null, customLogoIcon: null });
  },
};

function patch(key: TimerKey, partial: Partial<TimerState>): BroadcastState {
  return { ...state, timers: { ...state.timers, [key]: { ...state.timers[key], ...partial } } };
}

function patchScene(scene: SceneId, partial: Partial<SceneConfig>): BroadcastState {
  return { ...state, scenes: { ...state.scenes, [scene]: { ...state.scenes[scene], ...partial } } };
}

// Seconds remaining for a timer given "now".
export function remainingOf(t: TimerState, now: number): number {
  if (t.running && t.endsAt) return Math.max(0, Math.round((t.endsAt - now) / 1000));
  return t.pausedRemaining;
}
