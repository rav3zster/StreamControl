import { motion } from "motion/react";
import { Music } from "lucide-react";
import { Panel, SectionLabel } from "./primitives";

// ============================================================================
// MusicWidget — now-playing chip with a live equaliser. Small, quiet, alive.
// ============================================================================

const BARS = [0.4, 0.9, 0.55, 1, 0.7, 0.35, 0.85, 0.5, 0.95, 0.6];

export function Waveform({ color = "var(--nc-accent)", h = 22 }: { color?: string; h?: number }) {
  return (
    <div className="flex items-end gap-[3px]" style={{ height: h }}>
      {BARS.map((peak, i) => (
        <motion.span
          key={i}
          style={{ width: 3, borderRadius: 2, background: color }}
          animate={{ height: [h * 0.2, h * peak, h * 0.3] }}
          transition={{ duration: 0.9 + (i % 4) * 0.18, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}
        />
      ))}
    </div>
  );
}

export function MusicWidget({
  song = "Neon Skyline",
  artist = "Aphelion",
  glass = false,
  className = "",
  style,
}: {
  song?: string;
  artist?: string;
  glass?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Panel glass={glass} radius="md" className={`flex items-center gap-4 ${className}`} style={{ padding: "16px 20px", ...style }}>
      <span
        className="flex shrink-0 items-center justify-center"
        style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.28)" }}
      >
        <Music size={18} color="var(--nc-accent)" strokeWidth={2} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <SectionLabel accent="var(--nc-accent)">Now Playing</SectionLabel>
        <span className="truncate" style={{ fontSize: 15, fontWeight: 600, color: "var(--nc-highlight)" }}>
          {song} <span style={{ color: "var(--nc-text-3)", fontWeight: 400 }}>· {artist}</span>
        </span>
      </div>
      <Waveform />
    </Panel>
  );
}
