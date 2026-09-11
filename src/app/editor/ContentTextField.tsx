import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Type, ChevronDown, RotateCcw, Sparkles, Play, Bold, Italic, AlignLeft } from "lucide-react";
import type { TextStyleConfig, TextAnimationType } from "../store/broadcastStore";

const SWATCH_OPTIONS = [
  { label: "Default", value: "" },
  { label: "Pure White", value: "#ffffff" },
  { label: "Canary Yellow", value: "#fde047" },
  { label: "Hot Coral", value: "#ff5376" },
  { label: "Electric Blue", value: "#4f8cff" },
  { label: "Cyber Cyan", value: "#00e5ff" },
  { label: "Neon Magenta", value: "#ff2a85" },
  { label: "Warm Amber", value: "#f59e0b" },
];

const ANIMATION_OPTIONS: { id: TextAnimationType; label: string; hint: string }[] = [
  { id: "none", label: "None", hint: "Static text" },
  { id: "marquee", label: "Marquee ✦", hint: "Smooth scrolling broadcast ticker loop" },
  { id: "pulse", label: "Pulse", hint: "Breathing subtle glow" },
  { id: "shimmer", label: "Shimmer", hint: "Radiant metallic light sweep" },
  { id: "bounce", label: "Bounce", hint: "Floating gentle glide" },
];

const WEIGHT_OPTIONS = [
  { label: "Normal", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Bold", value: 700 },
  { label: "Black", value: 900 },
];

export function ContentTextField({
  label,
  value,
  placeholder,
  styleConfig,
  onChange,
  onStyleChange,
  onResetStyle,
}: {
  label: string;
  value: string;
  placeholder?: string;
  styleConfig?: TextStyleConfig;
  onChange: (v: string) => void;
  onStyleChange: (style: Partial<TextStyleConfig>) => void;
  onResetStyle: () => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const hasCustomStyle = Boolean(
    styleConfig?.fontSize ||
    styleConfig?.color ||
    styleConfig?.fontWeight ||
    styleConfig?.italic ||
    styleConfig?.uppercase ||
    (styleConfig?.animation && styleConfig.animation !== "none")
  );

  const currentAnimation = styleConfig?.animation || "none";
  const currentSize = styleConfig?.fontSize ?? 30;

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label and Dropdown Trigger Header */}
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "var(--nc-text-3)", textTransform: "uppercase" }}>
          {label}
        </span>

        {/* Small Dropdown Icon Button */}
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
            dropdownOpen
              ? "bg-[var(--nc-primary)] text-black font-bold"
              : hasCustomStyle
              ? "bg-[var(--nc-primary)]/15 text-[var(--nc-primary)] border border-[var(--nc-line-brand)]"
              : "text-[var(--nc-text-3)] hover:text-[var(--nc-text-2)] hover:bg-white/[0.04]"
          }`}
          title="Customize font size, color, style & animations like Marquee"
        >
          <Type size={11} />
          <span>Style</span>
          {currentAnimation !== "none" && (
            <span className="rounded px-1 text-[9px] uppercase tracking-wider bg-black/20 text-current font-black">
              {currentAnimation}
            </span>
          )}
          <motion.span animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
            <ChevronDown size={11} />
          </motion.span>
        </button>
      </div>

      {/* Main Text Input Box */}
      <div className="relative flex items-center">
        <input
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.03)",
            border: dropdownOpen ? "1px solid var(--nc-primary)" : "1px solid var(--nc-line-strong)",
            borderRadius: 10,
            color: "var(--nc-text)",
            fontSize: 13,
            padding: "9px 12px",
            outline: "none",
            fontFamily: "var(--nc-font)",
          }}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {/* Typography & Animation Dropdown Drawer */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-xl border border-[var(--nc-line-strong)] bg-[var(--nc-panel-2)] p-3.5 shadow-xl flex flex-col gap-3.5 my-1"
          >
            {/* Header / Reset */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--nc-highlight)]">
                <Sparkles size={12} color="var(--nc-primary)" />
                <span>Text Styling & Animation</span>
              </div>
              {hasCustomStyle && (
                <button
                  type="button"
                  onClick={onResetStyle}
                  className="flex items-center gap-1 text-[10px] text-[var(--nc-text-3)] hover:text-[var(--nc-primary)] cursor-pointer"
                >
                  <RotateCcw size={10} />
                  Reset
                </button>
              )}
            </div>

            {/* 1. ANIMATION SELECTION (Marquee, Pulse, etc.) */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                Animation Effect
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {ANIMATION_OPTIONS.map((anim) => {
                  const isSelected = currentAnimation === anim.id;
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

              {/* Marquee Speed Selector (when Marquee is active) */}
              {currentAnimation === "marquee" && (
                <div className="mt-1 flex items-center justify-between p-2 rounded-lg bg-black/30 border border-[var(--nc-line-brand)] text-xs">
                  <span className="text-[11px] text-[var(--nc-text-2)]">Marquee Speed:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { label: "Fast", sec: 8 },
                      { label: "Normal", sec: 14 },
                      { label: "Slow", sec: 22 },
                    ].map((spd) => (
                      <button
                        key={spd.label}
                        type="button"
                        onClick={() => onStyleChange({ marqueeSpeed: spd.sec })}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                          (styleConfig?.marqueeSpeed ?? 14) === spd.sec
                            ? "bg-[var(--nc-primary)] text-black font-bold"
                            : "bg-white/5 text-[var(--nc-text-3)] hover:text-white"
                        }`}
                      >
                        {spd.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. FONT SIZE CONTROLS */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                <span>Font Size</span>
                <span className="font-mono text-[var(--nc-primary)] text-xs">
                  {styleConfig?.fontSize ? `${styleConfig.fontSize}px` : "Default"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="14"
                  max="64"
                  step="2"
                  value={currentSize}
                  onChange={(e) => onStyleChange({ fontSize: Number(e.target.value) })}
                  className="flex-1 accent-[var(--nc-primary)] cursor-pointer"
                />
                <div className="flex items-center gap-1 shrink-0">
                  {[16, 24, 32, 44].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onStyleChange({ fontSize: sz })}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                        styleConfig?.fontSize === sz
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

            {/* 3. FONT COLOR */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                <span>Text Color</span>
                {styleConfig?.color && (
                  <span className="font-mono text-[10px] text-[var(--nc-text-2)]">{styleConfig.color}</span>
                )}
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
                        background: sw.value || "linear-gradient(135deg, #fff 50%, #888 50%)",
                      }}
                      title={sw.label}
                    />
                  );
                })}

                {/* Custom Color Input */}
                <label className="relative flex items-center justify-center w-5 h-5 rounded-full border border-white/20 bg-gradient-to-tr from-cyan-400 via-pink-500 to-yellow-400 cursor-pointer overflow-hidden" title="Custom color picker">
                  <input
                    type="color"
                    value={styleConfig?.color || "#ffffff"}
                    onChange={(e) => onStyleChange({ color: e.target.value })}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* 4. FONT WEIGHT & STYLE */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--nc-text-3)]">
                Font Style & Weight
              </span>
              <div className="flex items-center justify-between gap-1.5">
                {/* Weight buttons */}
                <div className="flex items-center gap-1 bg-black/30 p-1 rounded-lg border border-white/5">
                  {WEIGHT_OPTIONS.map((w) => (
                    <button
                      key={w.value}
                      type="button"
                      onClick={() => onStyleChange({ fontWeight: w.value })}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                        (styleConfig?.fontWeight ?? 700) === w.value
                          ? "bg-[var(--nc-primary)] text-black font-bold"
                          : "text-[var(--nc-text-3)] hover:text-white"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>

                {/* Italic & Uppercase */}
                <div className="flex items-center gap-1 bg-black/30 p-1 rounded-lg border border-white/5">
                  <button
                    type="button"
                    onClick={() => onStyleChange({ italic: !styleConfig?.italic })}
                    className={`w-6 h-6 rounded flex items-center justify-center text-xs cursor-pointer ${
                      styleConfig?.italic ? "bg-[var(--nc-primary)] text-black font-bold" : "text-[var(--nc-text-3)] hover:text-white"
                    }`}
                    title="Italic text"
                  >
                    <Italic size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onStyleChange({ uppercase: !styleConfig?.uppercase })}
                    className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold tracking-tight cursor-pointer ${
                      styleConfig?.uppercase ? "bg-[var(--nc-primary)] text-black font-bold" : "text-[var(--nc-text-3)] hover:text-white"
                    }`}
                    title="Uppercase text"
                  >
                    TT
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
