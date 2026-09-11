import { RotateCcw, SlidersHorizontal, Move } from "lucide-react";
import { useSceneConfig, useTimer, useLayoutEditMode, useWidgetPositions, SCENE_LIST } from "../store/useBroadcast";
import { store, type SceneId } from "../store/broadcastStore";
import { SCENE_SCHEMA, SOCIAL_PLATFORMS, ACCENT_PRESETS, RADIUS_PRESETS } from "../store/sceneSchema";
import { CollapsibleSection, TextField, TextArea, ToggleRow, Segmented, SwatchRow } from "./fields";
import { CountdownControls } from "./CountdownControls";
import { LogoUploader } from "./LogoUploader";

// ============================================================================
// ConfigPanel — the right sidebar. Whenever a scene is selected it rebuilds to
// show only that scene's configuration, generated from SCENE_SCHEMA. Editing
// anything here writes to the shared store, so the center preview and every OBS
// output feed update instantly. No controls ever live inside the canvas.
// ============================================================================

export function ConfigPanel({ scene }: { scene: SceneId }) {
  const cfg = useSceneConfig(scene);
  const schema = SCENE_SCHEMA[scene];
  const meta = SCENE_LIST.find((s) => s.id === scene)!;
  const startingTimer = useTimer("starting");
  const brbTimer = useTimer("brb");
  const timer = scene === "starting" ? startingTimer : scene === "brb" ? brbTimer : null;
  const editMode = useLayoutEditMode();
  const widgetPositions = useWidgetPositions(scene);
  const movedKeys = Object.keys(widgetPositions);

  return (
    <aside
      className="flex h-full shrink-0 flex-col"
      style={{ width: 340, borderLeft: "1px solid var(--nc-line)", background: "var(--nc-bg)" }}
    >
      {/* header */}
      <div className="flex shrink-0 items-center gap-2.5 px-5" style={{ height: 56, borderBottom: "1px solid var(--nc-line)" }}>
        <SlidersHorizontal size={15} color="var(--nc-primary)" />
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", color: "var(--nc-text)", textTransform: "uppercase" }}>
          {meta.label}
        </span>
        <span className="ml-auto" style={{ fontSize: 11, color: "var(--nc-text-3)", fontVariantNumeric: "tabular-nums" }}>
          Scene {meta.index}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* GENERAL */}
        <CollapsibleSection title="General" subtitle="Name, status, notes" defaultOpen>
          <div className="flex flex-col gap-1">
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "var(--nc-text-3)", textTransform: "uppercase" }}>Scene Name</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--nc-highlight)" }}>{meta.label}</span>
          </div>
          <div className="flex items-center justify-between" style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid var(--nc-line-strong)" }}>
            <span style={{ fontSize: 12, color: "var(--nc-text-2)" }}>Output Resolution</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--nc-text)", fontVariantNumeric: "tabular-nums" }}>1920 × 1080</span>
          </div>
          <TextArea
            label="Scene Notes"
            value={cfg.notes}
            placeholder="Private notes for this scene…"
            onChange={(v) => store.sceneSetNotes(scene, v)}
          />
        </CollapsibleSection>

        {/* BRANDING & CUSTOM LOGO */}
        <CollapsibleSection title="Branding & Logo" subtitle="Upload custom channel logo" defaultOpen>
          <LogoUploader />
        </CollapsibleSection>

        {/* FREELY MOVEABLE LAYOUT */}
        <CollapsibleSection title="Moveable Layout" subtitle="Reposition widgets & save layout" defaultOpen>
          <ToggleRow
            label="Freely Moveable Mode"
            hint="Show drag handles to reposition widgets freely on screen"
            checked={editMode}
            onChange={(v) => store.setLayoutEditMode(v)}
          />

          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between text-xs text-[var(--nc-text-3)]">
              <span>Moved Widgets in Scene:</span>
              <span className="font-mono font-bold text-[var(--nc-highlight)]">{movedKeys.length}</span>
            </div>

            {movedKeys.length > 0 && (
              <div className="flex flex-col gap-1.5 p-2.5 rounded-lg border border-[var(--nc-line)] bg-white/[0.02]">
                {movedKeys.map((k) => (
                  <div key={k} className="flex items-center justify-between text-xs">
                    <span className="capitalize text-[var(--nc-text-2)]">{k}</span>
                    <span className="font-mono text-[11px] text-[var(--nc-primary)]">
                      {widgetPositions[k].x > 0 ? `+${widgetPositions[k].x}` : widgetPositions[k].x},{" "}
                      {widgetPositions[k].y > 0 ? `+${widgetPositions[k].y}` : widgetPositions[k].y}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              disabled={movedKeys.length === 0}
              onClick={() => store.resetSceneLayout(scene)}
              className="mt-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{
                border: "1px solid var(--nc-line-strong)",
                background: "rgba(255,255,255,0.03)",
                color: "var(--nc-text-2)",
              }}
            >
              <RotateCcw size={12} />
              Reset This Scene Layout
            </button>
          </div>
        </CollapsibleSection>

        {/* APPEARANCE */}
        <CollapsibleSection title="Appearance" subtitle="Accent, radius, ambience">
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
            label="Ambient Effects"
            hint="Grid, particles, drifting auras"
            checked={cfg.appearance.ambient}
            onChange={(v) => store.sceneSetAppearance(scene, { ambient: v })}
          />
        </CollapsibleSection>

        {/* CONTENT */}
        {schema.content.length > 0 && (
          <CollapsibleSection title="Content" subtitle="Editable copy">
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
                <TextField
                  key={c.key}
                  label={c.label}
                  value={cfg.content[c.key] ?? ""}
                  placeholder={c.placeholder}
                  onChange={(v) => store.sceneSetContent(scene, c.key, v)}
                />
              )
            )}
          </CollapsibleSection>
        )}

        {/* COUNTDOWN — timer scenes only */}
        {schema.hasCountdown && timer && (
          <CollapsibleSection title="Countdown" subtitle="Timer transport" defaultOpen>
            <CountdownControls timer={timer} autoSwitchLabel={schema.autoSwitchLabel} />
          </CollapsibleSection>
        )}

        {/* WIDGETS */}
        <CollapsibleSection title="Widgets" subtitle="Enable / disable blocks" defaultOpen>
          {schema.widgets.map((w) => (
            <ToggleRow
              key={w.key}
              label={w.label}
              checked={cfg.widgets[w.key] !== false}
              onChange={(v) => store.sceneSetWidget(scene, w.key, v)}
            />
          ))}
        </CollapsibleSection>

        {/* SOCIAL LINKS */}
        {schema.hasSocial && (
          <CollapsibleSection title="Social Links" subtitle="Platforms shown in the footer">
            {SOCIAL_PLATFORMS.map((p) => (
              <ToggleRow
                key={p.key}
                label={p.label}
                hint={p.handle}
                checked={cfg.social[p.key] === true}
                onChange={(v) => store.sceneSetSocial(scene, p.key, v)}
              />
            ))}
          </CollapsibleSection>
        )}

        {/* ANIMATIONS */}
        <CollapsibleSection title="Animations" subtitle="Motion & ambience">
          <ToggleRow
            label="Enable animations"
            hint="Ambient motion, pulses, drifts"
            checked={cfg.animations}
            onChange={(v) => store.sceneSetAnimations(scene, v)}
          />
        </CollapsibleSection>

        {/* ADVANCED */}
        <CollapsibleSection title="Advanced" subtitle="Reset & metadata">
          <button
            onClick={() => {
              schema.widgets.forEach((w) => store.sceneSetWidget(scene, w.key, true));
            }}
            style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid var(--nc-line-strong)", color: "var(--nc-text-2)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
          >
            Enable all widgets
          </button>
          <button
            onClick={() => store.resetAllLayouts()}
            style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid var(--nc-line-strong)", color: "var(--nc-text-2)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
          >
            Reset all layouts (all scenes)
          </button>
          <div className="flex items-center justify-between" style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid var(--nc-line-strong)" }}>
            <span style={{ fontSize: 12, color: "var(--nc-text-3)" }}>Scene ID</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--nc-text)", fontFamily: "monospace" }}>{scene}</span>
          </div>
        </CollapsibleSection>
      </div>
    </aside>
  );
}
