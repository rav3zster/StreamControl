import { useState } from "react";
import { motion } from "motion/react";
import { Play, Pause, RotateCcw } from "lucide-react";
import type { BroadcastTimer } from "../store/useBroadcast";
import { SectionHeading, ToggleRow } from "./fields";

// ============================================================================
// CountdownControls — the timer transport for the right Configuration Panel's
// Countdown section. These controls exist ONLY here, never inside the broadcast
// preview. Drives the shared store, so every output feed updates instantly.
// ============================================================================

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

function NumField({ value, max, onCommit }: { value: string; max: number; onCommit: (n: number) => void }) {
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
        color: "var(--nc-highlight)",
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
}: {
  timer: BroadcastTimer;
  autoSwitchLabel?: string;
}) {
  const mins = Math.floor(timer.remaining / 60);
  const secs = timer.remaining % 60;

  return (
    <div className="flex flex-col gap-4">
      {/* status */}
      <div className="flex items-center justify-between">
        <SectionHeading>Current Time</SectionHeading>
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
      </div>

      {/* editable time */}
      <div className="flex items-center justify-center gap-2">
        <NumField value={String(mins).padStart(2, "0")} max={999} onCommit={(n) => timer.setDuration(n * 60 + secs)} />
        <span style={{ fontSize: 22, fontWeight: 700, color: "var(--nc-text-3)" }}>:</span>
        <NumField value={String(secs).padStart(2, "0")} max={59} onCommit={(n) => timer.setDuration(mins * 60 + n)} />
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
