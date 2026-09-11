import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Copy, ExternalLink, Check, Radio, Lock, Unlock, Move, RotateCcw, Magnet } from "lucide-react";
import { CanvasStage } from "../components/overlay/CanvasStage";
import { Wordmark } from "../components/overlay/primitives";
import { SceneView } from "../output/SceneView";
import { ConfigPanel } from "./ConfigPanel";
import { useBroadcastState, SCENE_LIST, sceneToSlug } from "../store/useBroadcast";
import { store } from "../store/broadcastStore";

// ============================================================================
// Editor — the Broadcast Control Panel.
//   LEFT   · Scene navigation (one active at a time)
//   CENTER · Clean 1920×1080 Program preview — ONLY what viewers see
//   RIGHT  · Scene Configuration Panel (data-driven, per scene)
// The editor never renders controls inside the canvas; it mutates shared state
// that the output feeds (OBS Browser Sources) subscribe to and reflect live.
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
    width: 30,
    height: 30,
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--nc-line-strong)",
    color: "var(--nc-text-2)",
    cursor: "pointer",
  };
  return (
    <div className="flex items-center gap-2.5" style={{ padding: "9px 11px", borderRadius: 11, background: "var(--nc-panel)", border: "1px solid var(--nc-line)" }}>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.16em", color: "var(--nc-text-3)", textTransform: "uppercase" }}>{label}</span>
        <span className="truncate" style={{ fontSize: 12, color: "var(--nc-text)", fontVariantNumeric: "tabular-nums" }}>{url}</span>
      </div>
      <button aria-label="Copy URL" onClick={copy} style={iconBtn}>
        {copied ? <Check size={13} color="var(--nc-accent)" /> : <Copy size={13} />}
      </button>
      <a aria-label="Open feed" href={url} target="_blank" rel="noreferrer" style={iconBtn}>
        <ExternalLink size={13} />
      </a>
    </div>
  );
}

export function Editor() {
  const state = useBroadcastState();
  const active = state.activeScene;
  const activeSlug = sceneToSlug(active);
  const scenePositions = state.widgetPositions[active] ?? {};
  const movedWidgetCount = Object.keys(scenePositions).length;

  return (
    <div className="flex h-screen w-full flex-col" style={{ background: "#050609", fontFamily: "var(--nc-font)", color: "var(--nc-text)" }}>
      {/* top bar */}
      <header className="flex shrink-0 items-center justify-between px-6" style={{ height: 56, borderBottom: "1px solid var(--nc-line)", background: "var(--nc-bg)" }}>
        <div className="flex items-center gap-4">
          <Wordmark size={32} />
          <span style={{ width: 1, height: 20, background: "var(--nc-line)" }} />
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.16em", color: "var(--nc-text-3)", textTransform: "uppercase" }}>
            Broadcast Control Panel
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Toggle Moveable Layout Button */}
          <button
            type="button"
            onClick={() => store.toggleLayoutEditMode()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            style={{
              background: state.layoutEditMode ? "rgba(79, 140, 255, 0.16)" : "rgba(255, 255, 255, 0.04)",
              border: state.layoutEditMode ? "1px solid var(--nc-primary)" : "1px solid var(--nc-line-strong)",
              color: state.layoutEditMode ? "var(--nc-highlight)" : "var(--nc-text-2)",
              boxShadow: state.layoutEditMode ? "0 0 14px rgba(79, 140, 255, 0.35)" : "none",
            }}
          >
            {state.layoutEditMode ? (
              <>
                <Unlock size={13} color="var(--nc-primary)" />
                <span>Move Layout: <strong style={{ color: "var(--nc-primary)" }}>ON</strong></span>
              </>
            ) : (
              <>
                <Lock size={13} />
                <span>Move Layout: <strong style={{ color: "var(--nc-text-3)" }}>OFF</strong></span>
              </>
            )}
          </button>

          <span style={{ fontSize: 12, color: "var(--nc-text-3)", letterSpacing: "0.08em" }}>1920 × 1080 · 16:9</span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* LEFT — scene navigation */}
        <nav className="flex shrink-0 flex-col gap-1.5 overflow-y-auto p-3" style={{ width: 240, borderRight: "1px solid var(--nc-line)", background: "var(--nc-bg)" }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", color: "var(--nc-text-3)", padding: "8px 12px 4px", textTransform: "uppercase" }}>
            Scenes
          </span>
          {SCENE_LIST.map((s) => {
            const isActive = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => store.setActiveScene(s.id)}
                className="flex w-full items-center gap-3 text-left transition-colors"
                style={{ padding: "11px 12px", borderRadius: 12, background: isActive ? "var(--nc-panel)" : "transparent", border: `1px solid ${isActive ? "var(--nc-line-strong)" : "transparent"}` }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "0.06em", color: isActive ? "var(--nc-primary)" : "var(--nc-text-3)" }}>{s.index}</span>
                <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 500, color: isActive ? "var(--nc-highlight)" : "var(--nc-text-2)" }}>{s.label}</span>
                {isActive && (
                  <span className="ml-auto flex items-center gap-1.5">
                    <Radio size={12} color="var(--nc-accent)" />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "var(--nc-accent)" }}>ON AIR</span>
                  </span>
                )}
              </button>
            );
          })}

          <div className="mt-auto px-3 pb-1" style={{ fontSize: 11, color: "var(--nc-text-3)", lineHeight: 1.6 }}>
            <span style={{ color: "var(--nc-text-2)", fontWeight: 600 }}>AXIOM Pack</span>
            <br />
            Broadcast engine · v2.1
          </div>
        </nav>

        {/* CENTER — clean program preview */}
        <main className="flex min-w-0 flex-1 flex-col p-6" style={{ background: "#050609", gap: 14 }}>
          {/* Top preview toolbar (completely outside the canvas so preview is never obstructed) */}
          <div className="flex shrink-0 items-center justify-between px-1" style={{ minHeight: 32 }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--nc-accent)] animate-pulse" />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "var(--nc-highlight)", textTransform: "uppercase" }}>
                  Program Canvas
                </span>
              </div>
              {state.layoutEditMode && (
                <span
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{
                    background: "rgba(79, 140, 255, 0.14)",
                    border: "1px solid var(--nc-line-brand)",
                    color: "var(--nc-primary)",
                  }}
                >
                  <Move size={11} /> Move & Resize Mode Active
                </span>
              )}
            </div>

            {/* Quick action controls when Move Mode is on */}
            {state.layoutEditMode && (
              <div className="flex items-center gap-2">
                {/* Snap toggle */}
                <button
                  type="button"
                  onClick={() => store.toggleSnap()}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                  style={{
                    background: state.snapEnabled ? "rgba(0, 229, 255, 0.15)" : "rgba(255, 255, 255, 0.04)",
                    border: state.snapEnabled ? "1px solid var(--nc-accent)" : "1px solid var(--nc-line)",
                    color: state.snapEnabled ? "var(--nc-accent)" : "var(--nc-text-3)",
                  }}
                  title="Snap to center, 8px grid, and other widgets"
                >
                  <Magnet size={12} />
                  <span>Snap: {state.snapEnabled ? "ON" : "OFF"}</span>
                </button>

                {movedWidgetCount > 0 && (
                  <button
                    type="button"
                    onClick={() => store.resetSceneLayout(active)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid var(--nc-line-strong)",
                      color: "var(--nc-text-2)",
                    }}
                  >
                    <RotateCcw size={11} />
                    Reset Scene ({movedWidgetCount})
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => store.setLayoutEditMode(false)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-black transition-all cursor-pointer"
                  style={{ background: "var(--nc-primary)" }}
                >
                  <Lock size={11} />
                  Lock Layout
                </button>
              </div>
            )}
          </div>

          <div className="relative w-full" style={{ aspectRatio: "16 / 9", flex: "1 1 auto", minHeight: 0, borderRadius: 20, overflow: "hidden", boxShadow: "var(--nc-shadow)", border: "1px solid var(--nc-line)" }}>
            <AnimatePresence mode="wait">
              <motion.div key={active} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
                <CanvasStage>
                  <SceneView scene={active} />
                </CanvasStage>
              </motion.div>
            </AnimatePresence>

            {/* Top-left Program badge */}
            <span className="absolute left-4 top-4 z-10 flex items-center gap-2 pointer-events-none" style={{ padding: "6px 12px", borderRadius: 999, background: "rgba(10,11,16,0.7)", backdropFilter: "blur(12px)", border: "1px solid var(--nc-line-strong)" }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "var(--nc-text-3)" }}>PROGRAM</span>
            </span>
          </div>

          {/* OBS output feeds */}
          <div className="shrink-0">
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: "var(--nc-text-3)", textTransform: "uppercase" }}>
              OBS Browser Sources
            </span>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <UrlRow label="Program feed (auto-switch)" path="/output" />
              <UrlRow label={`${SCENE_LIST.find((s) => s.id === active)!.label} feed`} path={`/output/${activeSlug}`} />
              <UrlRow label="Chat widget" path="/widgets/chat" />
            </div>
          </div>
        </main>

        {/* RIGHT — scene configuration */}
        <ConfigPanel scene={active} />
      </div>
    </div>
  );
}
