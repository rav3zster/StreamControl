import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, Pause, RotateCcw, ChevronDown, Timer } from "lucide-react";
import type { BroadcastTimer } from "../../store/useBroadcast";

// ============================================================================
// TimerController — EDITOR-ONLY panel that lives in the Scene Navigation,
// beneath the "Starting Soon" item. It drives the broadcast countdown without
// ever appearing inside the 1920×1080 output. Same AXIOM tokens & type.
// ============================================================================

const ctrlBtn = (active = false): React.CSSProperties => ({
  height: 34,
  borderRadius: 10,
  background: active ? "color-mix(in srgb, var(--nc-primary) 16%, transparent)" : "rgba(255,255,255,0.03)",
  border: `1px solid ${active ? "var(--nc-line-brand)" : "var(--nc-line-strong)"}`,
  color: active ? "var(--nc-primary)" : "var(--nc-text-2)",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.02em",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  cursor: "pointer",
});

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "var(--nc-text-3)", textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

// Numeric-only field (keyboard editable) for a two-digit time part.
function NumField({ value, max, onCommit }: { value: string; max: number; onCommit: (n: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? value;
  return (
    <input
      inputMode="numeric"
      value={shown}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 2);
        setDraft(digits);
      }}
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
        color: "var(--nc-highlight)",
        fontSize: 22,
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.01em",
        outline: "none",
      }}
    />
  );
}

export function TimerController({
  timer,
  autoSwitchLabel = "Auto-switch to Gameplay",
}: {
  timer: BroadcastTimer;
  autoSwitchLabel?: string;
}) {
  const [open, setOpen] = useState(true);
  const mins = Math.floor(timer.remaining / 60);
  const secs = timer.remaining % 60;

  return (
    <div
      className="mt-1.5"
      style={{ background: "var(--nc-panel)", border: "1px solid var(--nc-line-strong)", borderRadius: 16, overflow: "hidden" }}
    >
      {/* header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5"
        style={{ padding: "12px 14px", background: "transparent", cursor: "pointer" }}
      >
        <Timer size={15} color="var(--nc-primary)" strokeWidth={2} />
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "var(--nc-text)", textTransform: "uppercase" }}>
          Timer Controller
        </span>
        <span className="ml-auto flex items-center gap-2">
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: timer.running ? "var(--nc-accent)" : "var(--nc-text-3)",
              padding: "3px 8px",
              borderRadius: 999,
              border: `1px solid ${timer.running ? "rgba(0,229,255,0.35)" : "var(--nc-line-strong)"}`,
            }}
          >
            {timer.running ? "RUNNING" : "PAUSED"}
          </span>
          <motion.span animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.2 }} className="flex">
            <ChevronDown size={15} color="var(--nc-text-3)" />
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="flex flex-col gap-4" style={{ padding: "4px 14px 16px" }}>
              {/* countdown display + editable fields */}
              <div className="flex flex-col items-center gap-2 pt-2">
                <Label>Countdown</Label>
                <div className="flex items-center gap-2">
                  <NumField value={String(mins).padStart(2, "0")} max={999} onCommit={(n) => timer.setDuration(n * 60 + secs)} />
                  <span style={{ fontSize: 22, fontWeight: 700, color: "var(--nc-text-3)" }}>:</span>
                  <NumField value={String(secs).padStart(2, "0")} max={59} onCommit={(n) => timer.setDuration(mins * 60 + n)} />
                </div>
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
                <Label>Adjust</Label>
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => timer.adjust(-60)} style={ctrlBtn()}>−1m</button>
                  <button onClick={() => timer.adjust(-30)} style={ctrlBtn()}>−30s</button>
                  <button onClick={() => timer.adjust(30)} style={ctrlBtn()}>+30s</button>
                  <button onClick={() => timer.adjust(60)} style={ctrlBtn()}>+1m</button>
                </div>
              </div>

              {/* presets */}
              <div className="flex flex-col gap-2">
                <Label>Presets</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((min) => (
                    <button
                      key={min}
                      onClick={() => timer.setDuration(min * 60)}
                      style={ctrlBtn(timer.target === min * 60)}
                    >
                      {min}m
                    </button>
                  ))}
                </div>
              </div>

              {/* auto-switch toggle */}
              <button
                onClick={() => timer.setAutoSwitch(!timer.autoSwitch)}
                className="flex items-center justify-between"
                style={{ padding: "11px 12px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid var(--nc-line-strong)", cursor: "pointer" }}
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--nc-text)" }}>{autoSwitchLabel}</span>
                  <span style={{ fontSize: 11, color: "var(--nc-text-3)" }}>When the countdown hits 00:00</span>
                </div>
                <span
                  style={{
                    width: 40,
                    height: 22,
                    borderRadius: 999,
                    background: timer.autoSwitch ? "var(--nc-primary)" : "rgba(255,255,255,0.1)",
                    border: "1px solid var(--nc-line-strong)",
                    position: "relative",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <motion.span
                    className="absolute top-1/2 rounded-full"
                    style={{ width: 16, height: 16, background: "var(--nc-highlight)", y: "-50%" }}
                    animate={{ left: timer.autoSwitch ? 21 : 3 }}
                    transition={{ type: "spring", stiffness: 500, damping: 34 }}
                  />
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
