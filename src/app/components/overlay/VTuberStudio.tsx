import { motion } from "motion/react";
import { User, Cat } from "lucide-react";
import { HudCorner, LiveDot } from "./primitives";

// ============================================================================
// VTuberStudio — a themed cozy room with a TRANSPARENT model cutout in front.
// This replaces the person-webcam: OBS keys the center region while the room
// (shelves, window, rain, ambient RGB, plants) plays behind the avatar.
// The dashed cutout communicates the transparent VTuber area for compositing.
// ============================================================================

export function VTuberStudio({
  name = "AXIOM",
  role = "Duelist · Radiant",
  live = true,
  className = "",
  style,
  compact = false,
}: {
  name?: string;
  role?: string;
  live?: boolean;
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius: "var(--nc-r-lg)",
        border: "1px solid var(--nc-line-strong)",
        boxShadow: "var(--nc-shadow)",
        ...style,
      }}
    >
      {/* --- Themed room: lo-fi cyber apartment at night --- */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(165deg, #14121f 0%, #0d0f18 55%, #0a0b12 100%)" }}
      />
      {/* window with night-city glow + rain */}
      <div
        className="absolute"
        style={{
          right: "8%",
          top: "10%",
          width: "34%",
          height: "52%",
          borderRadius: 14,
          background: "linear-gradient(180deg, rgba(79,140,255,0.22), rgba(123,97,255,0.12))",
          border: "1px solid var(--nc-line-strong)",
          overflow: "hidden",
        }}
      >
        {/* distant city lights */}
        {[18, 42, 63, 80].map((l, i) => (
          <span key={i} className="absolute" style={{ left: `${l}%`, bottom: `${8 + (i % 3) * 12}%`, width: 3, height: 22 + (i % 3) * 14, background: "rgba(0,229,255,0.35)", borderRadius: 2 }} />
        ))}
        {/* rain streaks */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{ left: `${(i * 11) % 100}%`, width: 1, height: 26, background: "rgba(255,255,255,0.18)" }}
            animate={{ y: ["-30%", "160%"] }}
            transition={{ duration: 0.9 + (i % 3) * 0.3, repeat: Infinity, ease: "linear", delay: i * 0.12 }}
          />
        ))}
      </div>

      {/* RGB shelf on the left */}
      <div className="absolute" style={{ left: "6%", top: "16%", width: "22%", height: "58%" }}>
        {[0, 1, 2].map((row) => (
          <div key={row} className="mb-3" style={{ height: 3, borderRadius: 2, background: "var(--nc-line-strong)" }} />
        ))}
        <motion.div
          className="absolute inset-x-0 bottom-0"
          style={{ height: 46, borderRadius: 10, filter: "blur(6px)" }}
          animate={{ background: ["rgba(79,140,255,0.3)", "rgba(123,97,255,0.3)", "rgba(0,229,255,0.28)", "rgba(79,140,255,0.3)"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* plant */}
        <span className="absolute" style={{ bottom: 44, left: 4, fontSize: 0 }} />
      </div>

      {/* desk line */}
      <div className="absolute inset-x-0" style={{ bottom: "16%", height: 1, background: "var(--nc-line-strong)" }} />
      {/* ambient floor glow */}
      <motion.div
        className="absolute inset-x-0 bottom-0"
        style={{ height: "26%", background: "linear-gradient(0deg, rgba(79,140,255,0.14), transparent)" }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* --- Transparent VTuber model cutout --- */}
      <div className="absolute inset-0 flex items-end justify-center">
        <motion.div
          className="relative flex flex-col items-center justify-end"
          style={{ width: compact ? "42%" : "46%", height: "82%" }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-3"
            style={{
              borderRadius: "var(--nc-r-lg) var(--nc-r-lg) 0 0",
              border: "1.5px dashed var(--nc-line-brand)",
              borderBottom: "none",
              background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0 10px, transparent 10px 20px)",
            }}
          >
            <User size={compact ? 40 : 52} color="var(--nc-line-brand)" strokeWidth={1.5} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--nc-text-3)" }}>VTUBER MODEL</span>
            <span style={{ fontSize: 11, color: "var(--nc-text-3)", letterSpacing: "0.06em" }}>Transparent cutout · keyed in OBS</span>
          </div>
        </motion.div>
      </div>

      {/* readability scrim + identity */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 60%, rgba(8,9,13,0.86) 100%)" }} />

      <div className="pointer-events-none absolute inset-0">
        <HudCorner corner="tl" color="var(--nc-line-brand)" animated />
        <HudCorner corner="tr" color="var(--nc-line-brand)" animated />
        <HudCorner corner="bl" animated />
        <HudCorner corner="br" animated />
      </div>
      <div
        className="absolute inset-x-0 top-0"
        style={{ height: 2, background: "linear-gradient(90deg, var(--nc-primary), var(--nc-secondary))" }}
      />

      {live && (
        <div className="absolute left-4 top-4">
          <LiveDot />
        </div>
      )}
      <div className="absolute right-4 top-4 opacity-70">
        <Cat size={16} color="var(--nc-text-2)" strokeWidth={2} />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 px-5 pb-4 pt-8">
        <span style={{ width: 3, height: 26, borderRadius: 2, background: "linear-gradient(var(--nc-primary), var(--nc-secondary))" }} />
        <div className="flex flex-col">
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--nc-highlight)", lineHeight: 1.1 }}>{name}</span>
          <span style={{ fontSize: 11.5, color: "var(--nc-text-2)", letterSpacing: "0.02em" }}>{role}</span>
        </div>
      </div>
    </div>
  );
}
