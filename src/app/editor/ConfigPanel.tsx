import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Palette,
  Type,
  LayoutGrid,
  Radio,
  SlidersHorizontal,
  RotateCcw,
  Move,
  Magnet,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  Tv,
  Settings2,
} from "lucide-react";
import { useSceneConfig, useTimer, useLayoutEditMode, useWidgetPositions, useSnapEnabled, SCENE_LIST, sceneToSlug } from "../store/useBroadcast";
import { store, type SceneId } from "../store/broadcastStore";
import { SCENE_SCHEMA, SOCIAL_PLATFORMS, ACCENT_PRESETS, RADIUS_PRESETS } from "../store/sceneSchema";
import { TextField, TextArea, ToggleRow, Segmented, SwatchRow } from "./fields";
import { CountdownControls } from "./CountdownControls";
import { LogoUploader } from "./LogoUploader";
import { ThemeSelector } from "./ThemeSelector";
import { ContentTextField } from "./ContentTextField";

// ============================================================================
// ConfigPanel — Industry-Grade Scene Inspector.
// Categorized into 4 intuitive tabs:
//   1. DESIGN    · Theme, branding, accent color, corner radius, ambient effects
//   2. CONTENT   · Editable text, typography, marquee/animations, countdown timers
//   3. WIDGETS   · Block toggles, freely moveable mode, snapping, layer coordinates
//   4. BROADCAST · Social platforms, streamer notes, OBS source links, advanced
// ============================================================================

type InspectorTab = "design" | "content" | "widgets" | "broadcast";

const TABS: { id: InspectorTab; label: string; icon: typeof Palette }[] = [
  { id: "design", label: "Design", icon: Palette },
  { id: "content", label: "Content", icon: Type },
  { id: "widgets", label: "Widgets", icon: LayoutGrid },
  { id: "broadcast", label: "Broadcast", icon: Radio },
];

function feedUrl(path: string) {
  if (typeof window === "undefined") return `#${path}`;
  return `${window.location.href.split("#")[0]}#${path}`;
}

function MiniFeedCopy({ label, path }: { label: string; path: string }) {
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
    <div
      className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-[var(--nc-line)] transition-all"
      style={{ background: "rgba(255, 255, 255, 0.02)" }}
    >
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--nc-text-3)]">
          {label}
        </span>
        <span className="text-xs text-[var(--nc-text)] font-mono truncate">{path}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={copy}
          title="Copy feed URL"
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
          style={{
            background: copied ? "rgba(0, 229, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--nc-line-strong)",
            color: copied ? "var(--nc-accent)" : "var(--nc-text-2)",
          }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          title="Open in new window"
          className="p-1 rounded-lg text-[var(--nc-text-3)] hover:text-white hover:bg-white/10 transition-colors"
        >
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

export function ConfigPanel({ scene }: { scene: SceneId }) {
  const [activeTab, setActiveTab] = useState<InspectorTab>("design");
  const cfg = useSceneConfig(scene);
  const schema = SCENE_SCHEMA[scene];
  const meta = SCENE_LIST.find((s) => s.id === scene)!;
  const activeSlug = sceneToSlug(scene);

  const startingTimer = useTimer("starting");
  const brbTimer = useTimer("brb");
  const timer = scene === "starting" ? startingTimer : scene === "brb" ? brbTimer : null;

  const editMode = useLayoutEditMode();
  const snapEnabled = useSnapEnabled();
  const widgetPositions = useWidgetPositions(scene);
  const movedKeys = Object.keys(widgetPositions);

  return (
    <aside
      className="flex h-full shrink-0 flex-col"
      style={{
        width: 380,
        borderLeft: "1px solid var(--nc-line)",
        background: "var(--nc-bg)",
      }}
    >
      {/* 1. TOP SCENE HEADER BAR */}
      <div
        className="flex shrink-0 items-center justify-between px-5"
        style={{ height: 56, borderBottom: "1px solid var(--nc-line)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: "rgba(79, 140, 255, 0.12)", color: "var(--nc-primary)" }}
          >
            <SlidersHorizontal size={14} />
          </div>
          <div className="flex flex-col">
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", color: "var(--nc-highlight)" }}>
              {meta.label}
            </span>
            <span style={{ fontSize: 10, color: "var(--nc-text-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Inspector & Controls
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider"
            style={{ background: "rgba(255,255,255,0.06)", color: "var(--nc-text-3)" }}
          >
            Scene {meta.index}
          </span>
        </div>
      </div>

      {/* 2. CATEGORIZED TAB NAVIGATION */}
      <div
        className="grid grid-cols-4 p-1.5 gap-1 shrink-0 border-b border-[var(--nc-line)]"
        style={{ background: "rgba(0, 0, 0, 0.25)" }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              style={{
                color: isActive ? "var(--nc-highlight)" : "var(--nc-text-3)",
                background: isActive ? "var(--nc-panel)" : "transparent",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-highlight"
                  className="absolute inset-0 rounded-lg border border-[var(--nc-line-brand)] shadow-sm pointer-events-none"
                  style={{ background: "rgba(79, 140, 255, 0.12)" }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                />
              )}
              <Icon size={14} className="mb-1 shrink-0" style={{ color: isActive ? "var(--nc-primary)" : "inherit" }} />
              <span className="text-[11px] tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT BODY */}
      <div className="min-h-0 flex-1 overflow-y-auto p-5 space-y-6">
        <AnimatePresence mode="wait">
          {/* TAB 1: DESIGN */}
          {activeTab === "design" && (
            <motion.div
              key="tab-design"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              {/* Theme & Mood */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                  <Palette size={12} color="var(--nc-primary)" />
                  <span>Stream Theme & Mood</span>
                </div>
                <ThemeSelector scene={scene} />
              </div>

              {/* Channel Branding & Custom Logo */}
              <div className="space-y-2 pt-2 border-t border-[var(--nc-line)]">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                  <Sparkles size={12} color="var(--nc-accent)" />
                  <span>Channel Branding & Logo</span>
                </div>
                <LogoUploader />
              </div>

              {/* Appearance & Accents */}
              <div className="space-y-4 pt-2 border-t border-[var(--nc-line)]">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                  <Settings2 size={12} color="var(--nc-primary)" />
                  <span>Color & Geometry</span>
                </div>

                <SwatchRow
                  label="Accent Color"
                  value={cfg.appearance.accent}
                  options={ACCENT_PRESETS}
                  onChange={(v) => store.sceneSetAppearance(scene, { accent: v })}
                />

                <Segmented
                  label="Corner Radius"
                  value={cfg.appearance.radius}
                  options={RADIUS_PRESETS}
                  onChange={(v) => store.sceneSetAppearance(scene, { radius: v })}
                />

                <ToggleRow
                  label="Ambient Atmosphere"
                  hint="Dynamic grid particles, cyber auras and glowing accents"
                  checked={cfg.appearance.ambient}
                  onChange={(v) => store.sceneSetAppearance(scene, { ambient: v })}
                />
              </div>
            </motion.div>
          )}

          {/* TAB 2: CONTENT & TEXT */}
          {activeTab === "content" && (
            <motion.div
              key="tab-content"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              {/* Countdown Timer (if scene supports timer) */}
              {schema.hasCountdown && timer && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                    <Tv size={12} color="var(--nc-primary)" />
                    <span>Countdown Timer Transport</span>
                  </div>
                  <CountdownControls timer={timer} autoSwitchLabel={schema.autoSwitchLabel} />
                </div>
              )}

              {/* Scene Copy Fields */}
              {schema.content.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                    <Type size={12} color="var(--nc-accent)" />
                    <span>Editable Copy & Typography</span>
                  </div>

                  <div className="space-y-3.5">
                    {schema.content.map((c) =>
                      c.multiline ? (
                        <TextArea
                          key={c.key}
                          label={c.label}
                          value={cfg.content[c.key] ?? ""}
                          placeholder={c.placeholder}
                          onChange={(v) => store.sceneSetContent(scene, c.key, v)}
                        />
                      ) : (
                        <ContentTextField
                          key={c.key}
                          label={c.label}
                          value={cfg.content[c.key] ?? ""}
                          placeholder={c.placeholder}
                          styleConfig={cfg.contentStyles?.[c.key]}
                          onChange={(v) => store.sceneSetContent(scene, c.key, v)}
                          onStyleChange={(style) => store.sceneSetContentStyle(scene, c.key, style)}
                          onResetStyle={() => store.sceneResetContentStyle(scene, c.key)}
                        />
                      )
                    )}
                  </div>
                </div>
              ) : (
                !schema.hasCountdown && (
                  <div className="p-6 rounded-xl border border-[var(--nc-line)] bg-white/[0.02] text-center">
                    <Type size={24} className="mx-auto mb-2 opacity-30 text-[var(--nc-primary)]" />
                    <span className="text-sm font-semibold text-[var(--nc-text)] block mb-1">
                      No Text Blocks in this Scene
                    </span>
                    <span className="text-xs text-[var(--nc-text-3)]">
                      This scene focuses purely on visual gameplay and camera framing.
                    </span>
                  </div>
                )
              )}
            </motion.div>
          )}

          {/* TAB 3: WIDGETS & LAYOUT */}
          {activeTab === "widgets" && (
            <motion.div
              key="tab-widgets"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              {/* Freely Moveable Layout Mode Box */}
              <div className="p-4 rounded-xl border border-[var(--nc-line-brand)] bg-[rgba(79,140,255,0.04)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Move size={14} color="var(--nc-primary)" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--nc-highlight)]">
                      Move & Resize Layout
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => store.toggleLayoutEditMode()}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    style={{
                      background: editMode ? "var(--nc-primary)" : "rgba(255,255,255,0.08)",
                      color: editMode ? "#000" : "var(--nc-text)",
                    }}
                  >
                    {editMode ? "Active: ON" : "Turn ON"}
                  </button>
                </div>

                <p className="text-[11.5px] text-[var(--nc-text-2)] leading-relaxed">
                  When enabled, drag any overlay block on the preview canvas to reposition, resize with corner handles, or set layer hierarchy.
                </p>

                {/* Snap Status & Reset */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => store.toggleSnap()}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[var(--nc-text-2)] hover:text-white cursor-pointer"
                  >
                    <Magnet size={12} color={snapEnabled ? "var(--nc-accent)" : "var(--nc-text-3)"} />
                    <span>Magnetic Snap: <strong style={{ color: snapEnabled ? "var(--nc-accent)" : "inherit" }}>{snapEnabled ? "ON" : "OFF"}</strong></span>
                  </button>

                  {movedKeys.length > 0 && (
                    <button
                      type="button"
                      onClick={() => store.resetSceneLayout(scene)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[var(--nc-primary)] hover:underline cursor-pointer"
                    >
                      <RotateCcw size={10} />
                      <span>Reset Layout ({movedKeys.length})</span>
                    </button>
                  )}
                </div>

                {/* Moved widgets readout list */}
                {movedKeys.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1 p-2 rounded-lg bg-black/40 border border-white/5 text-[11px]">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--nc-text-3)] mb-0.5">
                      Repositioned Widgets:
                    </span>
                    {movedKeys.map((k) => (
                      <div key={k} className="flex items-center justify-between">
                        <span className="capitalize text-[var(--nc-text-2)]">{k}</span>
                        <span className="font-mono text-[var(--nc-accent)] text-[10px]">
                          ({widgetPositions[k].x > 0 ? `+${widgetPositions[k].x}` : widgetPositions[k].x},{" "}
                          {widgetPositions[k].y > 0 ? `+${widgetPositions[k].y}` : widgetPositions[k].y})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Scene Widget Blocks Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                    Scene Widgets
                  </span>
                  <span className="text-[11px] text-[var(--nc-text-3)]">
                    {schema.widgets.filter((w) => cfg.widgets[w.key] !== false).length} of {schema.widgets.length} active
                  </span>
                </div>

                <div className="space-y-2">
                  {schema.widgets.map((w) => (
                    <ToggleRow
                      key={w.key}
                      label={w.label}
                      checked={cfg.widgets[w.key] !== false}
                      onChange={(v) => store.sceneSetWidget(scene, w.key, v)}
                    />
                  ))}
                </div>
              </div>

              {/* Scene Motion Animations */}
              <div className="space-y-2 pt-2 border-t border-[var(--nc-line)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                  Motion & Effects
                </span>
                <ToggleRow
                  label="Enable Ambient Motion"
                  hint="Gentle float, pulsing separators and breathing indicators"
                  checked={cfg.animations}
                  onChange={(v) => store.sceneSetAnimations(scene, v)}
                />
              </div>
            </motion.div>
          )}

          {/* TAB 4: BROADCAST & STREAM */}
          {activeTab === "broadcast" && (
            <motion.div
              key="tab-broadcast"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              {/* Quick OBS Feeds for this Scene */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                  <Radio size={12} color="var(--nc-accent)" />
                  <span>OBS Browser Source Feeds</span>
                </div>
                <div className="space-y-2">
                  <MiniFeedCopy label="Program Feed (Auto-Switch)" path="/output" />
                  <MiniFeedCopy label={`${meta.label} Fixed Feed`} path={`/output/${activeSlug}`} />
                  <MiniFeedCopy label="Transparent Chat Widget" path="/widgets/chat" />
                </div>
              </div>

              {/* Social Platform Links */}
              {schema.hasSocial && (
                <div className="space-y-2.5 pt-2 border-t border-[var(--nc-line)]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                    Social Handles (Footer Bar)
                  </span>
                  <div className="space-y-2">
                    {SOCIAL_PLATFORMS.map((p) => (
                      <ToggleRow
                        key={p.key}
                        label={p.label}
                        hint={p.handle}
                        checked={cfg.social[p.key] === true}
                        onChange={(v) => store.sceneSetSocial(scene, p.key, v)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Scene Notes */}
              <div className="space-y-2 pt-2 border-t border-[var(--nc-line)]">
                <TextArea
                  label="Private Streamer Notes"
                  value={cfg.notes}
                  placeholder="Private notes for this scene (talking points, sponsor cues)…"
                  onChange={(v) => store.sceneSetNotes(scene, v)}
                />
              </div>

              {/* Advanced Actions */}
              <div className="space-y-2.5 pt-2 border-t border-[var(--nc-line)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                  Master Maintenance
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      schema.widgets.forEach((w) => store.sceneSetWidget(scene, w.key, true));
                    }}
                    className="p-2.5 rounded-xl border border-[var(--nc-line)] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-[var(--nc-text-2)] transition-colors cursor-pointer text-left"
                  >
                    Enable All Widgets
                  </button>
                  <button
                    type="button"
                    onClick={() => store.resetAllLayouts()}
                    className="p-2.5 rounded-xl border border-[var(--nc-line)] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-[var(--nc-text-2)] transition-colors cursor-pointer text-left"
                  >
                    Reset All Scenes
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
