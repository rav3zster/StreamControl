import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Copy,
  ExternalLink,
  Check,
  Radio,
  Lock,
  Unlock,
  Move,
  RotateCcw,
  Magnet,
  Palette,
  ChevronDown,
  ChevronUp,
  Tv,
  Share2,
  Sparkles,
} from "lucide-react";
import { CanvasStage } from "../components/overlay/CanvasStage";
import { Wordmark } from "../components/overlay/primitives";
import { SceneView } from "../output/SceneView";
import { ConfigPanel } from "./ConfigPanel";
import { useBroadcastState, SCENE_LIST, sceneToSlug, THEMES, THEME_LIST, type ThemeId } from "../store/useBroadcast";
import { store } from "../store/broadcastStore";

// ============================================================================
// Editor — Industry-Grade Broadcast Control Center.
//   LEFT   · Scene Director (Keyboard shortcuts 1-5, clean on-air cues)
//   CENTER · Studio Program Monitor (Maximized 16:9 canvas with responsive scaling,
//            compact collapsible OBS dock, studio framing)
//   RIGHT  · 4-Tab Scene Inspector (Design, Content, Widgets, Broadcast)
// ============================================================================

function feedUrl(path: string) {
  if (typeof window === "undefined") return `#${path}`;
  return `${window.location.href.split("#")[0]}#${path}`;
}

function UrlRow({ label, path }: { label: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = feedUrl(path);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked */
    }
  };
  const iconBtn: React.CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--nc-line-strong)",
    color: "var(--nc-text-2)",
    cursor: "pointer",
  };
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-xl border border-[var(--nc-line)] bg-[var(--nc-panel)] shadow-sm">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.16em", color: "var(--nc-text-3)", textTransform: "uppercase" }}>
          {label}
        </span>
        <span className="truncate font-mono" style={{ fontSize: 11.5, color: "var(--nc-text)" }}>
          {url}
        </span>
      </div>
      <button aria-label="Copy URL" onClick={copy} style={iconBtn} title="Copy URL">
        {copied ? <Check size={12} color="var(--nc-accent)" /> : <Copy size={12} />}
      </button>
      <a aria-label="Open feed" href={url} target="_blank" rel="noreferrer" style={iconBtn} title="Open in new window">
        <ExternalLink size={12} />
      </a>
    </div>
  );
}

function QuickCopyChip({ label, path }: { label: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = feedUrl(path);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={`Click to copy: ${url}`}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border"
      style={{
        background: copied ? "rgba(0, 229, 255, 0.15)" : "rgba(255, 255, 255, 0.04)",
        borderColor: copied ? "var(--nc-accent)" : "var(--nc-line-strong)",
        color: copied ? "var(--nc-accent)" : "var(--nc-text-2)",
      }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} className="opacity-70" />}
      <span>{label}</span>
    </button>
  );
}

export function Editor() {
  const state = useBroadcastState();
  const active = state.activeScene;
  const activeTheme = state.activeTheme;
  const activeThemeDef = THEMES[activeTheme] ?? THEMES["cyber-esports"];
  const activeSlug = sceneToSlug(active);
  const scenePositions = state.widgetPositions[active] ?? {};
  const movedWidgetCount = Object.keys(scenePositions).length;

  // Collapsible OBS Sources shelf state
  const [obsShelfOpen, setObsShelfOpen] = useState(false);

  // Global Keyboard Shortcuts (1-5 for scenes, M for move, S for snap)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      if (e.key >= "1" && e.key <= "5") {
        const idx = parseInt(e.key, 10) - 1;
        if (SCENE_LIST[idx]) {
          store.setActiveScene(SCENE_LIST[idx].id);
        }
      } else if (e.key.toLowerCase() === "m") {
        store.toggleLayoutEditMode();
      } else if (e.key.toLowerCase() === "s") {
        store.toggleSnap();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden" style={{ background: "#050609", fontFamily: "var(--nc-font)", color: "var(--nc-text)" }}>
      {/* 1. MASTER HEADER BAR */}
      <header className="flex shrink-0 items-center justify-between px-5" style={{ height: 52, borderBottom: "1px solid var(--nc-line)", background: "var(--nc-bg)" }}>
        <div className="flex items-center gap-3.5">
          <Wordmark size={30} />
          <span style={{ width: 1, height: 18, background: "var(--nc-line)" }} />
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "var(--nc-text-3)", textTransform: "uppercase" }}>
              Studio Control
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono text-[var(--nc-accent)] bg-[var(--nc-accent)]/10 border border-[var(--nc-accent)]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--nc-accent)] animate-pulse" />
              v2.1 LIVE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Selector */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              borderColor: "var(--nc-line-strong)",
            }}
          >
            <Palette size={12} color="var(--nc-primary)" />
            <span style={{ color: "var(--nc-text-3)", fontSize: 11 }}>Theme:</span>
            <select
              value={activeTheme}
              onChange={(e) => store.setTheme(e.target.value as ThemeId, false)}
              className="bg-transparent border-none text-xs font-bold cursor-pointer outline-none"
              style={{ color: "var(--nc-highlight)" }}
            >
              {THEME_LIST.map((t) => (
                <option key={t.id} value={t.id} style={{ background: "#12141c", color: "#ffffff" }}>
                  {t.name}
                </option>
              ))}
            </select>
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/50 ml-0.5"
              style={{ background: activeThemeDef.swatches[0] }}
            />
          </div>

          {/* Toggle Move Layout Mode Button */}
          <button
            type="button"
            onClick={() => store.toggleLayoutEditMode()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            style={{
              background: state.layoutEditMode ? "rgba(79, 140, 255, 0.16)" : "rgba(255, 255, 255, 0.04)",
              border: state.layoutEditMode ? "1px solid var(--nc-primary)" : "1px solid var(--nc-line-strong)",
              color: state.layoutEditMode ? "var(--nc-highlight)" : "var(--nc-text-2)",
              boxShadow: state.layoutEditMode ? "0 0 14px rgba(79, 140, 255, 0.35)" : "none",
            }}
            title="Press 'M' to toggle layout movement"
          >
            {state.layoutEditMode ? (
              <>
                <Unlock size={12} color="var(--nc-primary)" />
                <span>Move Layout: <strong style={{ color: "var(--nc-primary)" }}>ON</strong></span>
              </>
            ) : (
              <>
                <Lock size={12} />
                <span>Move Layout: <strong style={{ color: "var(--nc-text-3)" }}>OFF</strong></span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE (LEFT NAV, CENTER STAGE, RIGHT INSPECTOR) */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* LEFT — Scene Director */}
        <nav className="flex shrink-0 flex-col gap-1 overflow-y-auto p-3" style={{ width: 220, borderRight: "1px solid var(--nc-line)", background: "var(--nc-bg)" }}>
          <div className="flex items-center justify-between px-3 py-2 text-[10.5px] font-bold tracking-widest text-[var(--nc-text-3)] uppercase">
            <span>Scenes</span>
            <span className="text-[9px] font-mono text-[var(--nc-text-3)]/70">Keys 1-5</span>
          </div>

          {SCENE_LIST.map((s, idx) => {
            const isActive = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => store.setActiveScene(s.id)}
                className="group flex w-full items-center gap-2.5 text-left transition-all cursor-pointer rounded-xl px-3 py-2.5"
                style={{
                  background: isActive ? "var(--nc-panel)" : "transparent",
                  border: `1px solid ${isActive ? "var(--nc-line-brand)" : "transparent"}`,
                  boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
                }}
              >
                <span
                  className="flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold font-mono transition-colors"
                  style={{
                    background: isActive ? "var(--nc-primary)" : "rgba(255, 255, 255, 0.05)",
                    color: isActive ? "#000" : "var(--nc-text-3)",
                  }}
                >
                  {idx + 1}
                </span>

                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "var(--nc-highlight)" : "var(--nc-text-2)",
                  }}
                >
                  {s.label}
                </span>

                {isActive && (
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--nc-accent)] animate-ping" />
                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: "var(--nc-accent)" }}>
                      LIVE
                    </span>
                  </span>
                )}
              </button>
            );
          })}

          <div className="mt-auto p-3 rounded-xl border border-[var(--nc-line)] bg-white/[0.02] text-[11px] text-[var(--nc-text-3)]">
            <span className="font-semibold text-[var(--nc-text-2)] block mb-0.5">AXIOM Pro Overlay</span>
            <span className="text-[10px] block leading-tight">Broadcast-Grade Engine for OBS Studio & Twitch</span>
          </div>
        </nav>

        {/* CENTER — Studio Program Monitor */}
        <main className="flex min-w-0 flex-1 flex-col p-4 overflow-hidden" style={{ background: "#050609", gap: 10 }}>
          {/* Top Canvas Toolbar */}
          <div className="flex shrink-0 items-center justify-between px-1" style={{ minHeight: 28 }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--nc-accent)] animate-pulse" />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "var(--nc-highlight)", textTransform: "uppercase" }}>
                  Program Monitor
                </span>
                <span className="text-[11px] text-[var(--nc-text-3)] font-mono">
                  1920×1080 · 60 FPS
                </span>
              </div>

              {state.layoutEditMode && (
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold"
                  style={{
                    background: "rgba(79, 140, 255, 0.16)",
                    border: "1px solid var(--nc-primary)",
                    color: "var(--nc-highlight)",
                  }}
                >
                  <Move size={10} color="var(--nc-primary)" />
                  <span>Layout Editor Active</span>
                </span>
              )}
            </div>

            {/* Quick Action Controls */}
            <div className="flex items-center gap-2">
              {state.layoutEditMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => store.toggleSnap()}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                    style={{
                      background: state.snapEnabled ? "rgba(0, 229, 255, 0.15)" : "rgba(255, 255, 255, 0.04)",
                      border: state.snapEnabled ? "1px solid var(--nc-accent)" : "1px solid var(--nc-line)",
                      color: state.snapEnabled ? "var(--nc-accent)" : "var(--nc-text-3)",
                    }}
                    title="Snap to center, 8px grid, and other widgets (Key: S)"
                  >
                    <Magnet size={11} />
                    <span>Snap: {state.snapEnabled ? "ON" : "OFF"}</span>
                  </button>

                  {movedWidgetCount > 0 && (
                    <button
                      type="button"
                      onClick={() => store.resetSceneLayout(active)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-[var(--nc-text-2)] hover:text-white bg-white/5 border border-[var(--nc-line-strong)]"
                      title="Reset positions of widgets in this scene"
                    >
                      <RotateCcw size={11} />
                      <span>Reset ({movedWidgetCount})</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => store.setLayoutEditMode(false)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-black transition-all cursor-pointer"
                    style={{ background: "var(--nc-primary)" }}
                  >
                    <Lock size={11} />
                    Lock
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => store.setLayoutEditMode(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-[var(--nc-text-3)] hover:text-white bg-white/5 border border-[var(--nc-line-strong)] transition-colors cursor-pointer"
                  title="Enable freely moveable layout mode"
                >
                  <Move size={11} />
                  <span>Edit Layout</span>
                </button>
              )}
            </div>
          </div>

          {/* Program Canvas Container — Generous 16:9 with dark studio stage frame */}
          <div
            className="relative w-full flex-1 min-h-0 flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl"
            style={{
              aspectRatio: "16 / 9",
              background: "#020306",
              border: "1px solid var(--nc-line)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8), inset 0 0 1px rgba(255,255,255,0.1)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <CanvasStage editable>
                  <SceneView scene={active} />
                </CanvasStage>
              </motion.div>
            </AnimatePresence>

            {/* Studio Top Badge */}
            <span
              className="absolute left-4 top-4 z-10 flex items-center gap-2 pointer-events-none"
              style={{
                padding: "5px 11px",
                borderRadius: 999,
                background: "rgba(10,11,16,0.75)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--nc-line-strong)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--nc-accent)] animate-pulse" />
              <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.2em", color: "var(--nc-text-2)" }}>
                PROGRAM FEED
              </span>
            </span>
          </div>

          {/* Bottom Dock — Compact OBS Browser Feeds Drawer */}
          <div
            className="shrink-0 rounded-xl border border-[var(--nc-line)] transition-all overflow-hidden"
            style={{ background: "var(--nc-panel)" }}
          >
            {/* Collapsed / Header Strip */}
            <div className="flex items-center justify-between px-3.5 py-2">
              <div className="flex items-center gap-2.5">
                <Radio size={13} color="var(--nc-accent)" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--nc-highlight)]">
                  OBS Browser Sources
                </span>
                <div className="hidden sm:flex items-center gap-1.5 ml-2">
                  <QuickCopyChip label="Copy Program Feed" path="/output" />
                  <QuickCopyChip label={`Copy ${SCENE_LIST.find((s) => s.id === active)!.label}`} path={`/output/${activeSlug}`} />
                  <QuickCopyChip label="Copy Chat Widget" path="/widgets/chat" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setObsShelfOpen((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[var(--nc-text-3)] hover:text-white cursor-pointer px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span>{obsShelfOpen ? "Hide URLs" : "View Full URLs"}</span>
                {obsShelfOpen ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
              </button>
            </div>

            {/* Expandable Full URLs Cards */}
            <AnimatePresence>
              {obsShelfOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-[var(--nc-line)] p-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    <UrlRow label="Program Feed (Auto-Switch)" path="/output" />
                    <UrlRow label={`${SCENE_LIST.find((s) => s.id === active)!.label} Feed`} path={`/output/${activeSlug}`} />
                    <UrlRow label="Standalone Chat Widget" path="/widgets/chat" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* RIGHT — 4-Tab Scene Inspector */}
        <ConfigPanel scene={active} />
      </div>
    </div>
  );
}
