import { motion } from "motion/react";
import { AmbientBackground } from "../AmbientBackground";
import { Wordmark, SectionLabel, HudCorner, Panel, Avatar } from "../primitives";
import { SocialBar } from "../widgets";
import { MusicWidget } from "../MusicWidget";
import { BRAND, LATEST } from "../data";
import type { SceneConfig, TextStyleConfig } from "../../../store/broadcastStore";
import { on, pick } from "../sceneConfig";
import { MoveableWidget } from "../MoveableWidget";
import { StyledText } from "../StyledText";

// ============================================================================
// SCENE 01 — Starting Soon
// Large countdown, stream title, socials, and quiet animated placeholders.
// Composition is intentionally offset left for a human, editorial balance.
//
// Data-driven: which blocks appear (countdown, title, music, latest, socials)
// and the copy all come from the scene's SceneConfig — the layout reflows to
// stay centered/balanced when a block is disabled.
// ============================================================================

function TimeUnit({
  value,
  label,
  styleConfig,
}: {
  value: string;
  label: string;
  styleConfig?: TextStyleConfig;
}) {
  const fontSize = styleConfig?.fontSize ? `${styleConfig.fontSize}px` : "148px";
  const color = styleConfig?.color || "var(--nc-primary)";
  const fontWeight = styleConfig?.fontWeight ?? 800;
  const fontStyle = styleConfig?.italic ? "italic" : "normal";
  const animation = styleConfig?.animation || "none";

  const digitStyle: React.CSSProperties = {
    fontSize,
    fontWeight,
    letterSpacing: "-0.04em",
    lineHeight: 0.9,
    color,
    fontStyle,
    fontVariantNumeric: "tabular-nums",
  };

  return (
    <div className="flex flex-col items-center">
      {animation === "pulse" ? (
        <motion.span
          style={digitStyle}
          animate={{ opacity: [1, 0.45, 1], scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {value}
        </motion.span>
      ) : animation === "shimmer" ? (
        <motion.span
          style={{
            ...digitStyle,
            backgroundImage: `linear-gradient(90deg, ${color} 0%, #ffffff 40%, ${color} 80%)`,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          animate={{ backgroundPosition: ["200% center", "-200% center"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          {value}
        </motion.span>
      ) : animation === "bounce" ? (
        <motion.span
          style={digitStyle}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          {value}
        </motion.span>
      ) : (
        <span style={digitStyle}>{value}</span>
      )}
      <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.3em", color: "var(--nc-text-3)", marginTop: 12 }}>
        {label}
      </span>
    </div>
  );
}

function LatestCard({ label, name, accent }: { label: string; name: string; accent: string }) {
  return (
    <Panel glass radius="md" className="flex items-center gap-3.5" style={{ padding: "16px 20px" }}>
      <Avatar name={name} size={40} />
      <div className="flex flex-col gap-1">
        <SectionLabel accent={accent}>{label}</SectionLabel>
        <span style={{ fontSize: 16, fontWeight: 700, color: "var(--nc-highlight)" }}>{name}</span>
      </div>
    </Panel>
  );
}

// Timer state is owned by the editor and passed in, so no controls ever render
// inside the broadcast canvas — only the readout below.
export function StartingSoon({
  m = "10",
  s = "00",
  config,
}: {
  m?: string;
  s?: string;
  config: SceneConfig;
}) {
  const title = pick(config, "title", BRAND.streamTitle);
  const tagline = pick(config, "tagline", BRAND.tagline);
  const category = pick(config, "category", BRAND.category);
  const infoRow = on(config, "musicWidget") || on(config, "latestFollow") || on(config, "latestSub");

  return (
    <div className="relative h-full w-full">
      <AmbientBackground animated={config.animations} />

      {/* frame ticks */}
      <div className="pointer-events-none absolute inset-10 z-10">
        <HudCorner corner="tl" size={40} />
        <HudCorner corner="tr" size={40} />
        <HudCorner corner="bl" size={40} />
        <HudCorner corner="br" size={40} />
      </div>

      {/* top row */}
      <MoveableWidget scene="starting" id="header" label="Scene Header" className="absolute inset-x-20 top-16 z-20 flex items-center justify-between">
        <Wordmark size={64} />
        <SectionLabel accent="var(--nc-accent)">Stream begins shortly</SectionLabel>
      </MoveableWidget>

      {/* centered stack, nudged up for optical balance */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none" style={{ paddingBottom: 60 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center pointer-events-auto"
        >
          {on(config, "countdown") && (() => {
            const timerStyle = config.contentStyles?.["countdown"];
            const colonSize = timerStyle?.fontSize ? Math.round(timerStyle.fontSize * 0.8) : 120;
            const colonColor = timerStyle?.color || "var(--nc-primary)";
            return (
              <MoveableWidget scene="starting" id="countdown" label="Countdown" className="flex flex-col items-center">
                <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.42em", color: "var(--nc-primary)", marginBottom: 28 }}>
                  STARTING SOON
                </span>

                <div className="flex items-center" style={{ gap: 40 }}>
                  <TimeUnit value={m} label="MINUTES" styleConfig={timerStyle} />
                  <motion.span
                    style={{
                      fontSize: colonSize,
                      fontWeight: 300,
                      color: colonColor,
                      opacity: 0.75,
                      lineHeight: 0.9,
                      marginTop: -18,
                    }}
                    animate={config.animations ? { opacity: [0.9, 0.25, 0.9] } : undefined}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    :
                  </motion.span>
                  <TimeUnit value={s} label="SECONDS" styleConfig={timerStyle} />
                </div>
              </MoveableWidget>
            );
          })()}

          {on(config, "streamTitle") && (
            <MoveableWidget scene="starting" id="streamTitle" label="Stream Title" className="mt-12 flex flex-col items-center gap-4">
              <StyledText
                text={title}
                styleConfig={config.contentStyles?.["title"]}
                defaultStyle={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--nc-highlight)" }}
              />
              <div className="flex items-center gap-3">
                <span style={{ width: 30, height: 1, background: "var(--nc-line-strong)" }} />
                <StyledText
                  text={tagline}
                  styleConfig={config.contentStyles?.["tagline"]}
                  defaultStyle={{ fontSize: 14, color: "var(--nc-text-2)", letterSpacing: "0.04em" }}
                />
                <span style={{ width: 30, height: 1, background: "var(--nc-line-strong)" }} />
              </div>
            </MoveableWidget>
          )}
        </motion.div>
      </div>

      {/* info row: now playing + latest follow / sub — keeps the wait engaging */}
      {infoRow && (
        <motion.div
          className="absolute inset-x-0 bottom-32 z-20 flex items-stretch justify-center gap-5 pointer-events-none"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {on(config, "musicWidget") && (
            <div className="pointer-events-auto">
              <MoveableWidget scene="starting" id="musicWidget" label="Music Widget">
                <MusicWidget glass style={{ width: 340 }} />
              </MoveableWidget>
            </div>
          )}
          {on(config, "latestFollow") && (
            <div className="pointer-events-auto">
              <MoveableWidget scene="starting" id="latestFollow" label="Latest Follower">
                <LatestCard label="Latest Follower" name={LATEST.follower} accent="var(--nc-primary)" />
              </MoveableWidget>
            </div>
          )}
          {on(config, "latestSub") && (
            <div className="pointer-events-auto">
              <MoveableWidget scene="starting" id="latestSub" label="Latest Subscriber">
                <LatestCard label="Latest Subscriber" name={LATEST.subscriber} accent="var(--nc-secondary)" />
              </MoveableWidget>
            </div>
          )}
        </motion.div>
      )}

      {/* socials */}
      {on(config, "socialLinks") && (
        <MoveableWidget scene="starting" id="socialLinks" label="Social Links" className="absolute inset-x-20 bottom-20 z-20 flex items-center justify-between">
          <SocialBar enabled={config.social} />
          <SectionLabel>{category}</SectionLabel>
        </MoveableWidget>
      )}
    </div>
  );
}
