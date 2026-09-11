import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw, Type, ChevronDown, Sparkles, Italic } from "lucide-react";
import type { BroadcastTimer } from "../store/useBroadcast";
import type { TextStyleConfig, TextAnimationType, SceneId } from "../store/broadcastStore";
import { SectionHeading, ToggleRow } from "./fields";

// ============================================================================
// CountdownControls — the timer transport for the right Configuration Panel's
// Countdown section. Includes interactive Style button for customizing digit
// color, font size, animations (pulse, shimmer, bounce), and typography.
// Defaults dynamically to the scene's Accent Color!
// ============================================================================

const SWATCH_OPTIONS = [
  { label: "Default (Accent Color)", value: "" },
  { label: "Pure White", value: "#ffffff" },
  { label: "Canary Yellow", value: "#fde047" },
  { label: "Hot Coral", value: "#ff5376" },
  { label: "Electric Blue", value: "#4f8cff" },
  { label: "Cyber Cyan", value: "#00e5ff" },
  { label: "Neon Magenta", value: "#ff2a85" },
  { label: "Warm Amber", value: "#f59e0b" },
];

const ANIMATION_OPTIONS: { id: TextAnimationType; label: string; hint: string }[] = [
  { id: "none", label: "None", hint: "Static digits" },
  { id: "pulse", label: "Pulse", hint: "Breathing rhythmic glow" },
  { id: "shimmer", label: "Shimmer", hint: "Radiant metallic light sweep" },
  { id: "bounce", label: "Bounce", hint: "Floating gentle rhythm" },
];

const WEIGHT_OPTIONS = [
  { label: "Normal", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Bold", value: 700 },
  { label: "Black", value: 900 },
];

const ctrlBtn = (active = false): React.CSSProperties => ({
  height: 34,
  borderRadius: 10,
  background: active ? "color-mix(in srgb, var(--nc-primary) 16%, transparent)" : "rgba(255,255,255,0.03)",
  border: `1px solid ${active ? "var(--nc-line-brand)" : "var(--nc-line-strong)"}`,
  color: active ? "var(--nc-primary)" : "var(--nc-text-2)",
  fontSize: 12,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  cursor: "pointer",
});

function NumField({
  value,
  max,
  color,
  onCommit,
}: {
  value: string;
  max: number;
  color?: string;
  onCommit: (n: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? value;
  return (
    <input
      inputMode="numeric"
      value={shown}
      onChange={(e) => setDraft(e.target.value.replace(/\D/g, "").slice(0, 2))}
      onBlur={() => {
        if (draft !== null) {
          const n = Math.min(max, parseInt(draft || "0", 10));
          onCommit(isNaN(n) ? 0 : n);
          setDraft(null);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
      style={{
        width: 56,
        height: 44,
        textAlign: "center",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid var(--nc-line-strong)",
        borderRadius: 12,
        color: color || "var(--nc-primary)",
        fontSize: 22,
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
        outline: "none",
      }}
    />
  );
}

export function CountdownControls({
  timer,
  autoSwitchLabel = "Auto-switch scene",
  styleConfig,
  onStyleChange,
  onResetStyle,
  sceneId,
}: {
  timer: BroadcastTimer;
  autoSwitchLabel?: string;
  styleConfig?: TextStyleConfig;
  onStyleChange?: (style: Partial<TextStyleConfig>) => void;
  onResetStyle?: () => void;
  sceneId?: SceneId;
}) {
  const [styleOpen, setStyleOpen] = useState(false);
  const mins = Math.floor(timer.remaining / 60);
  const secs = timer.remaining % 60;

  const hasCustomStyle = Boolean(
    styleConfig?.fontSize ||
    styleConfig?.color ||
    styleConfig?.fontWeight ||
    styleConfig?.italic ||
    (styleConfig?.animation && styleConfig.animation !== "none")
  );

  const isBrb = sceneId === "brb";
  const defaultSize = isBrb ? 40 : 148;
  const defaultWeight = isBrb ? 700 : 800;
  const minSize = isBrb ? 20 : 72;
  const maxSize = isBrb ? 80 : 220;
  const stepSize = isBrb ? 2 : 4;
  const sizePresets = isBrb ? [28, 36, 40, 56] : [100, 128, 148, 180];
  const timerColor = styleConfig?.color || "var(--nc-primary)";

  return (
    <div className="flex flex-col gap-4">
      {/* status and style button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SectionHeading>Current Time</SectionHeading>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: timer.running ? "var(--nc-accent)" : "var(--nc-text-3)",
              padding: "2px 7px",
              borderRadius: 999,
              border: `1px solid ${timer.running ? "rgba(0,229,255,0.35)" : "var(--nc-line-strong)"}`,
            }}
          >
            {timer.running ? "RUNNING" : "PAUSED"}
          </span>
        </div>

        {onStyleChange && onResetStyle && (
          <button
            type="button"
            onClick={() => setStyleOpen((v) => !v)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              styleOpen
                ? "bg-[var(--nc-primary)] text-black font-bold"
                : hasCustomStyle
                ? "bg-[var(--nc-primary)]/15 text-[var(--nc-primary)] border border-[var(--nc-line-brand)]"
                : "text-[var(--nc-text-3)] hover:text-[var(--nc-text-2)] hover:bg-white/[0.04]"
            }`}
            title="Customize timer digits color, size, font weight & animation"
          >
            <Type size={11} />
            <span>Style</span>
            {styleConfig?.animation && styleConfig.animation !== "none" && (
              <span className="rounded px-1 text-[9px] uppercase tracking-wider bg-black/20 text-current font-black">
                {styleConfig.animation}
              </span>
            )}
            <motion.span animate={{ rotate: styleOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
              <ChevronDown size={11} />
            </motion.span>
          </button>
        )}
      </div>

      {/* Typography & Style Drawer */}
      <AnimatePresence>
        {styleOpen && onStyleChange && onResetStyle && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-xl border border-[var(--nc-line-strong)] bg-[var(--nc-panel-2)] p-3.5 shadow-xl flex flex-col gap-3.5"
          >
            {/* Drawer Header with Reset */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--nc-highlight)]">
                <Sparkles size={12} color="var(--nc-primary)" />
                <span>Timer Typography & Appearance</span>
              </div>
              {hasCustomStyle && (
                <button
                  type="button"
                  onClick={onResetStyle}
                  className="flex items-center gap-1 text-[10px] text-[var(--nc-text-3)] hover:text-[var(--nc-primary)] cursor-pointer"
                >
                  <RotateCcw size={10} />
                  Reset to Accent
                </button>
              )}
            </div>

            {/* 1. DIGIT COLOR */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                <span>Timer Color</span>
                <span className="font-mono text-[10px] text-[var(--nc-primary)]">
                  {styleConfig?.color ? styleConfig.color : "Accent Color (Auto)"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {SWATCH_OPTIONS.map((sw) => {
                  const isSelected = (styleConfig?.color ?? "") === sw.value;
                  return (
                    <button
                      key={sw.label}
                      type="button"
                      onClick={() => onStyleChange({ color: sw.value })}
                      className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                        isSelected ? "scale-125 border-white ring-2 ring-[var(--nc-primary)]" : "border-black/40 hover:scale-110"
                      }`}
                      style={{
                        background: sw.value || "var(--nc-primary)",
                      }}
                      title={sw.label}
                    />
                  );
                })}

                {/* Custom Color Input */}
                <label className="relative flex items-center justify-center w-5 h-5 rounded-full border border-white/20 bg-gradient-to-tr from-cyan-400 via-pink-500 to-yellow-400 cursor-pointer overflow-hidden" title="Custom color picker">
                  <input
                    type="color"
                    value={styleConfig?.color || "#4f8cff"}
                    onChange={(e) => onStyleChange({ color: e.target.value })}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>
              </div>
              <p className="text-[10px] text-[var(--nc-text-3)] leading-relaxed">
                Default automatically syncs with the <strong>Accent Color</strong> chosen in the Design tab.
              </p>
            </div>

            {/* 2. ANIMATION EFFECT */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                Animation Effect
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {ANIMATION_OPTIONS.map((anim) => {
                  const isSelected = (styleConfig?.animation || "none") === anim.id;
                  return (
                    <button
                      key={anim.id}
                      type="button"
                      onClick={() => onStyleChange({ animation: anim.id })}
                      className={`flex flex-col items-start p-2 rounded-lg text-left transition-all border cursor-pointer ${
                        isSelected
                          ? "border-[var(--nc-primary)] bg-[var(--nc-primary)]/15 text-[var(--nc-highlight)] font-bold shadow-sm"
                          : "border-white/5 bg-black/20 text-[var(--nc-text-2)] hover:border-white/10 hover:bg-black/30"
                      }`}
                    >
                      <span className="text-xs">{anim.label}</span>
                      <span className="text-[9px] text-[var(--nc-text-3)] leading-tight">{anim.hint}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. FONT SIZE */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                <span>Digit Size</span>
                <span className="font-mono text-[var(--nc-primary)] text-xs">
                  {styleConfig?.fontSize ? `${styleConfig.fontSize}px` : `Default (${defaultSize}px)`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={minSize}
                  max={maxSize}
                  step={stepSize}
                  value={styleConfig?.fontSize ?? defaultSize}
                  onChange={(e) => onStyleChange({ fontSize: Number(e.target.value) })}
                  className="flex-1 accent-[var(--nc-primary)] cursor-pointer"
                />
                <div className="flex items-center gap-1 shrink-0">
                  {sizePresets.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onStyleChange({ fontSize: sz })}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                        (styleConfig?.fontSize ?? defaultSize) === sz
                          ? "bg-[var(--nc-primary)] text-black font-bold"
                          : "bg-black/30 text-[var(--nc-text-3)] hover:text-white"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. FONT WEIGHT & ITALIC */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                Weight & Slant
              </span>
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1 bg-black/30 p-1 rounded-lg border border-white/5">
                  {WEIGHT_OPTIONS.map((w) => (
                    <button
                      key={w.value}
                      type="button"
                      onClick={() => onStyleChange({ fontWeight: w.value })}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                        (styleConfig?.fontWeight ?? defaultWeight) === w.value
                          ? "bg-[var(--nc-primary)] text-black font-bold"
                          : "text-[var(--nc-text-3)] hover:text-white"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => onStyleChange({ italic: !styleConfig?.italic })}
                  className={`w-7 h-7 rounded flex items-center justify-center text-xs cursor-pointer border ${
                    styleConfig?.italic
                      ? "bg-[var(--nc-primary)] text-black font-bold border-transparent"
                      : "bg-black/30 text-[var(--nc-text-3)] hover:text-white border-white/5"
                  }`}
                  title="Italicize timer digits"
                >
                  <Italic size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* editable time */}
      <div className="flex items-center justify-center gap-2">
        <NumField value={String(mins).padStart(2, "0")} max={999} color={timerColor} onCommit={(n) => timer.setDuration(n * 60 + secs)} />
        <span style={{ fontSize: 22, fontWeight: 700, color: timerColor }}>:</span>
        <NumField value={String(secs).padStart(2, "0")} max={59} color={timerColor} onCommit={(n) => timer.setDuration(mins * 60 + n)} />
      </div>

      {/* transport */}
      <div className="grid grid-cols-3 gap-2">
        <button onClick={timer.start} style={ctrlBtn(timer.running)}>
          <Play size={13} strokeWidth={2.5} /> Start
        </button>
        <button onClick={timer.pause} style={ctrlBtn(!timer.running)}>
          <Pause size={13} strokeWidth={2.5} /> Pause
        </button>
        <button onClick={timer.reset} style={ctrlBtn()}>
          <RotateCcw size={13} strokeWidth={2.5} /> Reset
        </button>
      </div>

      {/* adjustments */}
      <div className="flex flex-col gap-2">
        <SectionHeading>Adjust</SectionHeading>
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => timer.adjust(-60)} style={ctrlBtn()}>−1m</button>
          <button onClick={() => timer.adjust(-30)} style={ctrlBtn()}>−30s</button>
          <button onClick={() => timer.adjust(30)} style={ctrlBtn()}>+30s</button>
          <button onClick={() => timer.adjust(60)} style={ctrlBtn()}>+1m</button>
        </div>
      </div>

      {/* presets */}
      <div className="flex flex-col gap-2">
        <SectionHeading>Quick Presets</SectionHeading>
        <div className="grid grid-cols-4 gap-2">
          {[5, 10, 15, 30].map((min) => (
            <button key={min} onClick={() => timer.setDuration(min * 60)} style={ctrlBtn(timer.target === min * 60)}>
              {min}m
            </button>
          ))}
        </div>
      </div>

      <ToggleRow
        label={autoSwitchLabel}
        hint="When the countdown hits 00:00"
        checked={timer.autoSwitch}
        onChange={(v) => timer.setAutoSwitch(v)}
      />
    </div>
  );
}

