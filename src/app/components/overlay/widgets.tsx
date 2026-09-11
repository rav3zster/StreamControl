import { motion } from "motion/react";
import {
  Heart,
  Star,
  DollarSign,
  Radio,
  Gift,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Panel, SectionLabel, Divider, Avatar, LogoIcon } from "./primitives";
import { RECENT_EVENTS, type EventKind, type StreamEvent } from "./data";
import { SOCIAL_PLATFORMS } from "../../store/sceneSchema";

// ============================================================================
// Reusable broadcast widgets. Each is a self-contained, named asset that can
// be dropped into any scene: Goal Bar, Event List, Social Bar, Name Plate,
// Sponsor Banner, Alert Frame.
// ============================================================================

const EVENT_META: Record<EventKind, { icon: LucideIcon; color: string; verb: string }> = {
  follow: { icon: Heart, color: "var(--nc-primary)", verb: "New follower" },
  sub: { icon: Star, color: "var(--nc-secondary)", verb: "Subscribed" },
  donation: { icon: DollarSign, color: "var(--nc-accent)", verb: "Donated" },
  raid: { icon: Radio, color: "var(--nc-primary)", verb: "Raided" },
  cheer: { icon: Gift, color: "var(--nc-secondary)", verb: "Cheered" },
};

/* --- GoalBar ---------------------------------------------------------------
   Thin progress track, blue→violet fill, tabular figures. */
export function GoalBar({
  label,
  current,
  target,
  accent = "var(--nc-primary)",
}: {
  label: string;
  current: number;
  target: number;
  accent?: string;
}) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between">
        <SectionLabel accent={accent}>{label}</SectionLabel>
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--nc-text-2)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span style={{ color: "var(--nc-highlight)", fontWeight: 700 }}>
            {current.toLocaleString()}
          </span>{" "}
          / {target.toLocaleString()}
        </span>
      </div>
      <div
        className="relative overflow-hidden"
        style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.06)" }}
      >
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{
            borderRadius: 999,
            background: "linear-gradient(90deg, var(--nc-primary), var(--nc-secondary))",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* pulsing head — mini celebration / live progress indicator */}
          <motion.span
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full"
            style={{ width: 10, height: 10, background: "var(--nc-highlight)" }}
            animate={{ boxShadow: ["0 0 0 0 rgba(255,255,255,0.5)", "0 0 0 6px rgba(255,255,255,0)"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}

/* --- EventListRow / EventList ----------------------------------------------
   Profile avatar + an animated type badge (icon in a soft pulsing chip). */
function EventRow({ ev }: { ev: StreamEvent }) {
  const meta = EVENT_META[ev.kind];
  const Icon = meta.icon;
  return (
    <div className="flex items-center gap-3.5 py-3">
      <span className="relative">
        <Avatar name={ev.user} size={36} />
        {/* animated type badge pinned to the avatar */}
        <motion.span
          className="absolute -bottom-1 -right-1 flex items-center justify-center"
          style={{
            width: 18,
            height: 18,
            borderRadius: 6,
            background: "var(--nc-panel)",
            border: `1px solid ${meta.color}`,
          }}
          animate={{ boxShadow: [`0 0 0 0 ${meta.color}00`, `0 0 8px 1px ${meta.color}55`, `0 0 0 0 ${meta.color}00`] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon size={10} color={meta.color} strokeWidth={2.5} />
        </motion.span>
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span style={{ fontSize: 15, fontWeight: 600, color: "var(--nc-highlight)" }}>{ev.user}</span>
        <span style={{ fontSize: 12, color: "var(--nc-text-3)", letterSpacing: "0.01em" }}>
          {meta.verb} · <span style={{ opacity: 0.6 }}>{ev.time}</span>
        </span>
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: meta.color,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {ev.detail}
      </span>
    </div>
  );
}

/* --- TimerControls ---------------------------------------------------------
   OBS transport for countdowns: pause / resume / reset. Quiet ghost buttons. */
export function TimerControls({
  running,
  onToggle,
  onReset,
}: {
  running: boolean;
  onToggle: () => void;
  onReset: () => void;
}) {
  const btn: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--nc-line-strong)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--nc-text-2)",
  };
  return (
    <div className="flex items-center gap-2.5">
      <button aria-label={running ? "Pause" : "Resume"} onClick={onToggle} style={btn}>
        {running ? <Pause size={16} strokeWidth={2} /> : <Play size={16} strokeWidth={2} />}
      </button>
      <button aria-label="Reset" onClick={onReset} style={btn}>
        <RotateCcw size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

export function EventList({
  title = "Recent Events",
  events = RECENT_EVENTS,
  className = "",
  glass = false,
}: {
  title?: string;
  events?: StreamEvent[];
  className?: string;
  glass?: boolean;
}) {
  return (
    <Panel glass={glass} className={className} style={{ padding: 24 }}>
      <div className="mb-1 flex items-center justify-between">
        <SectionLabel accent="var(--nc-accent)">{title}</SectionLabel>
        <span style={{ fontSize: 11, color: "var(--nc-text-3)", letterSpacing: "0.1em" }}>LIVE</span>
      </div>
      <Divider className="my-2" />
      <div className="flex flex-col">
        {events.map((ev, i) => (
          <div key={ev.id}>
            {i > 0 && <Divider />}
            <EventRow ev={ev} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* --- SocialBar -------------------------------------------------------------
   Sources from SOCIAL_PLATFORMS so per-scene toggles (from the config panel)
   add/remove platforms; the bar re-centers itself automatically. */
export function SocialBar({
  className = "",
  vertical = false,
  enabled,
}: {
  className?: string;
  vertical?: boolean;
  enabled?: Record<string, boolean>;
}) {
  const items = SOCIAL_PLATFORMS.filter((p) =>
    enabled ? enabled[p.key] : ["twitch", "youtube", "x", "discord"].includes(p.key)
  );

  return (
    <div
      className={`flex ${vertical ? "flex-col items-start gap-4" : "items-center gap-7"} ${className}`}
    >
      {items.map((s) => (
        <div key={s.key} className="flex items-center gap-2.5">
          <span
            style={{ width: 5, height: 5, borderRadius: 2, background: "var(--nc-primary)" }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", color: "var(--nc-text-3)", textTransform: "uppercase" }}>
            {s.label}
          </span>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--nc-text)" }}>{s.handle}</span>
        </div>
      ))}
    </div>
  );
}

/* --- NamePlate -------------------------------------------------------------
   Compact identity chip — role tick, name, handle. */
export function NamePlate({
  name,
  role,
  handle,
}: {
  name: string;
  role: string;
  handle: string;
}) {
  return (
    <Panel glass radius="md" style={{ padding: "14px 20px" }} className="inline-flex items-center gap-4">
      <LogoIcon size={36} />
      <span style={{ width: 3, height: 34, borderRadius: 2, background: "linear-gradient(var(--nc-primary), var(--nc-secondary))" }} />
      <div className="flex flex-col">
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--nc-highlight)" }}>{name}</span>
        <span style={{ fontSize: 12, color: "var(--nc-text-3)", letterSpacing: "0.02em" }}>{role} · {handle}</span>
      </div>
    </Panel>
  );
}

/* --- SponsorBanner --------------------------------------------------------- */
export function SponsorBanner({ className = "" }: { className?: string }) {
  const sponsors = ["NOVA", "PULSE", "HYPERX", "AETHER"];
  return (
    <Panel glass radius="md" className={`inline-flex items-center gap-6 ${className}`} style={{ padding: "12px 22px" }}>
      <SectionLabel>Partners</SectionLabel>
      <div className="flex items-center gap-6">
        {sponsors.map((s) => (
          <span key={s} style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.2em", color: "var(--nc-text-2)" }}>
            {s}
          </span>
        ))}
      </div>
    </Panel>
  );
}

/* --- AlertFrame ------------------------------------------------------------
   The toast that fires on a new event. Used in scenes as a live demo. */
export function AlertFrame({
  kind = "donation",
  user = "Nightfall",
  detail = "$25.00",
  message = "thanks for the amazing content!",
  className = "",
}: {
  kind?: EventKind;
  user?: string;
  detail?: string;
  message?: ReactNode;
  className?: string;
}) {
  const meta = EVENT_META[kind];
  const Icon = meta.icon;
  return (
    <Panel
      glass
      className={`inline-flex items-center gap-5 ${className}`}
      style={{ padding: "18px 26px", boxShadow: "var(--nc-glow-brand)", borderColor: "var(--nc-line-brand)" }}
    >
      <span
        className="flex items-center justify-center"
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: "rgba(79,140,255,0.12)",
          border: "1px solid var(--nc-line-brand)",
        }}
      >
        <Icon size={24} color={meta.color} strokeWidth={2} />
      </span>
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span style={{ fontSize: 18, fontWeight: 700, color: "var(--nc-highlight)" }}>{user}</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: meta.color }}>{detail}</span>
        </div>
        <span style={{ fontSize: 13, color: "var(--nc-text-2)" }}>{message}</span>
      </div>
      <LogoIcon size={32} />
    </Panel>
  );
}

export { Trophy };
