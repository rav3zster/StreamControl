import { motion } from "motion/react";
import { Wordmark, LiveDot, Divider, LogoIcon } from "./primitives";
import { BRAND, MATCH } from "./data";

// ============================================================================
// Broadcast chrome — the minimal top navigation strip and the professional
// lower-third information bar. Both are full-width, hairline-separated.
// ============================================================================

/* --- TopStrip --------------------------------------------------------------
   Minimal top navigation: wordmark · category tabs · live + clock. */
export function TopStrip({ clock }: { clock: string }) {
  const tabs = ["OVERVIEW", "MATCH", "STATS"];
  return (
    <div
      className="flex items-center justify-between px-8"
      style={{
        height: 64,
        background: "rgba(10,11,16,0.72)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid var(--nc-line)",
      }}
    >
      <div className="flex items-center gap-7">
        <Wordmark size={44} />
        <Divider vertical className="h-6" />
        <div className="flex items-center gap-6">
          {tabs.map((t, i) => (
            <span
              key={t}
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.16em",
                color: i === 0 ? "var(--nc-highlight)" : "var(--nc-text-3)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.14em", color: "var(--nc-text-2)", fontVariantNumeric: "tabular-nums" }}>
          {clock}
        </span>
        <Divider vertical className="h-6" />
        <LiveDot />
      </div>
    </div>
  );
}

/* --- LowerThird ------------------------------------------------------------
   Professional information bar. Live match telemetry: game · rank · objective
   · win streak · session time. Each field is a quiet stat cell on the grid. */
function StatCell({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex flex-col justify-center gap-1 px-6">
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "var(--nc-text-3)", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: accent ?? "var(--nc-highlight)", fontVariantNumeric: "tabular-nums" }}>
        {value}
      </span>
    </div>
  );
}

export function LowerThird({
  sessionTime = "03:18:29",
  game = MATCH.game,
  rank = MATCH.rank,
  objective = MATCH.objective,
}: {
  sessionTime?: string;
  game?: string;
  rank?: string;
  objective?: string;
}) {
  return (
    <div
      className="flex items-stretch overflow-hidden"
      style={{
        borderRadius: "var(--nc-r-md)",
        border: "1px solid var(--nc-line)",
        background: "rgba(18,20,28,0.82)",
        backdropFilter: "blur(20px)",
        boxShadow: "var(--nc-shadow-soft)",
      }}
    >
      <div className="flex items-center gap-4 px-6 py-4">
        <span style={{ width: 4, height: 42, borderRadius: 2, background: "linear-gradient(var(--nc-primary), var(--nc-secondary))" }} />
        <LogoIcon size={44} />
        <div className="flex flex-col">
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--nc-primary)" }}>{game}</span>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--nc-highlight)", lineHeight: 1.15 }}>
            {BRAND.streamTitle}
          </span>
        </div>
      </div>

      <div className="flex flex-1 items-stretch">
        {[
          { label: "Rank", value: rank, accent: "var(--nc-primary)" },
          { label: "Objective", value: objective },
          { label: "Win Streak", value: MATCH.winStreak, accent: "var(--nc-accent)" },
        ].map((c) => (
          <div key={c.label} className="flex items-stretch">
            <span style={{ width: 1, background: "var(--nc-line)" }} />
            <StatCell {...c} />
          </div>
        ))}
        {/* session time — the one animated field, ticking live */}
        <div className="flex items-stretch">
          <span style={{ width: 1, background: "var(--nc-line)" }} />
          <div className="flex items-center gap-2.5 px-6">
            <motion.span
              style={{ width: 7, height: 7, borderRadius: 999, background: "var(--nc-accent)" }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <StatCell label="Session" value={sessionTime} />
          </div>
        </div>
      </div>
    </div>
  );
}
