import { motion } from "motion/react";
import { QrCode } from "lucide-react";
import { AmbientBackground } from "../AmbientBackground";
import { Wordmark, SectionLabel, Panel, Divider, HudCorner } from "../primitives";
import { SocialBar } from "../widgets";
import { SCHEDULE, BRAND, SESSION_STATS } from "../data";
import type { SceneConfig } from "../../../store/broadcastStore";
import { on, pick } from "../sceneConfig";
import { MoveableWidget } from "../MoveableWidget";

// ============================================================================
// SCENE 05 — Stream Ending
// Thank-you statement, upcoming schedule, socials, and a QR placeholder.
// A calm, professional finishing layout — two balanced columns.
// ============================================================================

function QrCard({ label, caption, accent }: { label: string; caption: string; accent: string }) {
  return (
    <Panel style={{ padding: 20, flex: 1 }} className="flex flex-col items-center gap-3">
      <div
        className="flex items-center justify-center"
        style={{ width: 96, height: 96, borderRadius: 16, background: "var(--nc-panel-2)", border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)` }}
      >
        <QrCode size={58} color={accent} strokeWidth={1.5} />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--nc-highlight)" }}>{label}</span>
        <span style={{ fontSize: 12, color: "var(--nc-text-3)" }}>{caption}</span>
      </div>
    </Panel>
  );
}

export function StreamEnding({ config }: { config: SceneConfig }) {
  const heading = pick(config, "heading", "See you\nnext time.");
  const tagline = pick(config, "tagline", BRAND.tagline);
  const rightCol = on(config, "schedule") || on(config, "qrCodes");

  return (
    <div className="relative h-full w-full">
      <AmbientBackground animated={config.animations} />

      <div className="pointer-events-none absolute inset-10 z-10">
        <HudCorner corner="tl" size={40} />
        <HudCorner corner="tr" size={40} />
        <HudCorner corner="bl" size={40} />
        <HudCorner corner="br" size={40} />
      </div>

      <MoveableWidget scene="ending" id="header" label="Scene Header" className="absolute inset-x-20 top-16 z-20 flex items-center justify-between">
        <Wordmark size={60} />
        <SectionLabel accent="var(--nc-accent)">Stream ended</SectionLabel>
      </MoveableWidget>

      <div className="absolute inset-x-20 z-20 flex items-center gap-20" style={{ top: 180, bottom: 130 }}>
        {/* LEFT — thank you */}
        <div className="flex flex-1 flex-col justify-center">
          <MoveableWidget scene="ending" id="heading" label="Closing Statement">
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: 18, fontWeight: 600, letterSpacing: "0.4em", color: "var(--nc-primary)", marginBottom: 20, display: "block" }}
            >
              THANK YOU FOR WATCHING
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: 132, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.86, color: "var(--nc-highlight)", whiteSpace: "pre-line", display: "block" }}
            >
              {heading}
            </motion.span>

            <div className="mt-12 flex items-center gap-5">
              <span style={{ width: 56, height: 1, background: "var(--nc-line-strong)" }} />
              <span style={{ fontSize: 15, color: "var(--nc-text-2)", letterSpacing: "0.03em" }}>{tagline}</span>
            </div>
          </MoveableWidget>

          {/* today's stats — the session recap */}
          {on(config, "sessionStats") && (
            <MoveableWidget scene="ending" id="sessionStats" label="Session Stats">
              <div className="mt-10 flex items-stretch gap-8">
                {SESSION_STATS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--nc-highlight)", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                      {s.value}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", color: "var(--nc-text-3)", textTransform: "uppercase" }}>
                      {s.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </MoveableWidget>
          )}

          {on(config, "socialLinks") && (
            <MoveableWidget scene="ending" id="socialLinks" label="Social Links">
              <div className="mt-10">
                <SocialBar enabled={config.social} />
              </div>
            </MoveableWidget>
          )}
        </div>

        {/* RIGHT — schedule + QR */}
        {rightCol && (
          <div className="flex flex-col gap-6" style={{ width: 460 }}>
            {on(config, "schedule") && (
              <MoveableWidget scene="ending" id="schedule" label="Schedule Panel">
                <Panel style={{ padding: 28 }}>
                  <SectionLabel accent="var(--nc-secondary)">Upcoming Schedule</SectionLabel>
                  <div className="mt-4 flex flex-col">
                    {SCHEDULE.map((item, i) => (
                      <div key={item.day}>
                        {i > 0 && <Divider />}
                        <div className="flex items-center gap-4 py-3.5">
                          <span
                            className="flex items-center justify-center"
                            style={{ width: 48, height: 30, borderRadius: 8, background: "rgba(79,140,255,0.1)", border: "1px solid var(--nc-line-brand)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "var(--nc-primary)" }}
                          >
                            {item.day}
                          </span>
                          <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color: "var(--nc-highlight)" }}>{item.title}</span>
                          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--nc-text-2)", fontVariantNumeric: "tabular-nums" }}>{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </MoveableWidget>
            )}

            {on(config, "qrCodes") && (
              <MoveableWidget scene="ending" id="qrCodes" label="QR Cards">
                <div className="flex gap-6">
                  <QrCard label="Recent Clips" caption="Best moments" accent="var(--nc-accent)" />
                  <QrCard label="Discord" caption="Join the server" accent="var(--nc-secondary)" />
                </div>
              </MoveableWidget>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
