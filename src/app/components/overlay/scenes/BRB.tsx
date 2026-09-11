import { motion } from "motion/react";
import { Pause, Heart, MessageCircle } from "lucide-react";
import { AmbientBackground } from "../AmbientBackground";
import { Wordmark, SectionLabel, HudCorner, Panel, Divider, Avatar } from "../primitives";
import { SocialBar } from "../widgets";
import { MusicWidget } from "../MusicWidget";
import { LATEST } from "../data";
import type { SceneConfig } from "../../../store/broadcastStore";
import { on, pick } from "../sceneConfig";
import { MoveableWidget } from "../MoveableWidget";

// ============================================================================
// SCENE 04 — Be Right Back
// Big statement type, a compact return timer, ambient composition, socials.
// Timer state is owned by the editor and passed in, so no controls render in
// the canvas — only the readout. Blocks + copy come from the scene config.
// ============================================================================

export function BRB({
  m = "05",
  s = "00",
  running = true,
  config,
}: {
  m?: string;
  s?: string;
  running?: boolean;
  config: SceneConfig;
}) {
  const message = pick(config, "message", "Chat is still open — say hi 👋");
  const thanks = pick(config, "thanks", "Thanks for waiting ❤️");
  const hasPanel =
    on(config, "musicWidget") || on(config, "latestFollow") || on(config, "chatNote") || on(config, "socialLinks");

  return (
    <div className="relative h-full w-full">
      <AmbientBackground animated={config.animations} />

      <div className="pointer-events-none absolute inset-10 z-10">
        <HudCorner corner="tl" size={40} />
        <HudCorner corner="br" size={40} />
      </div>

      <MoveableWidget scene="brb" id="header" label="Scene Header" className="absolute inset-x-20 top-16 z-20 flex items-center justify-between">
        <Wordmark size={60} />
        <SectionLabel accent="var(--nc-accent)">Stream paused</SectionLabel>
      </MoveableWidget>

      {/* left-weighted statement for editorial balance */}
      <MoveableWidget
        scene="brb"
        id="countdown"
        label="BRB Statement & Timer"
        className="absolute z-20 flex flex-col"
        style={{ left: 128, top: "50%", marginTop: -140 }}
      >
        <div className="mb-5 flex items-center gap-4">
          <motion.span
            className="flex items-center justify-center"
            style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(79,140,255,0.12)", border: "1px solid var(--nc-line-brand)" }}
            animate={config.animations ? { opacity: [0.6, 1, 0.6] } : undefined}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Pause size={18} color="var(--nc-primary)" strokeWidth={2.5} />
          </motion.span>
          <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: "0.4em", color: "var(--nc-primary)" }}>BE RIGHT</span>
        </div>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: 208, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.82, color: "var(--nc-highlight)" }}
        >
          BACK
        </motion.span>

        {on(config, "countdown") && (() => {
          const timerStyle = config.contentStyles?.["countdown"];
          const timerFontSize = timerStyle?.fontSize ? `${timerStyle.fontSize}px` : "40px";
          const timerColor = timerStyle?.color || "var(--nc-primary)";
          const timerFontWeight = timerStyle?.fontWeight ?? 700;
          const timerFontStyle = timerStyle?.italic ? "italic" : "normal";
          const timerAnim = timerStyle?.animation || "none";

          return (
            <div className="mt-12 flex items-center gap-6">
              <span style={{ width: 64, height: 1, background: "var(--nc-line-strong)" }} />
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 15, color: "var(--nc-text-3)", letterSpacing: "0.14em" }}>BACK IN</span>
                <motion.span
                  style={{
                    fontSize: timerFontSize,
                    fontWeight: timerFontWeight,
                    color: timerColor,
                    fontStyle: timerFontStyle,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.01em",
                  }}
                  animate={
                    timerAnim === "pulse"
                      ? { opacity: [1, 0.45, 1], scale: [1, 1.04, 1] }
                      : timerAnim === "bounce"
                      ? { y: [0, -4, 0] }
                      : { opacity: running ? 1 : [1, 0.4, 1] }
                  }
                  transition={{ duration: timerAnim === "pulse" ? 1.8 : 1.4, repeat: running && timerAnim === "none" ? 0 : Infinity }}
                >
                  {m}:{s}
                </motion.span>
              </div>
            </div>
          );
        })()}
      </MoveableWidget>

      {/* right info panel — keeps viewers company while paused */}
      {hasPanel && (
        <motion.div
          className="absolute z-20 flex w-[420px] flex-col gap-4"
          style={{ right: 128, top: "50%", marginTop: -180 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {on(config, "musicWidget") && (
            <MoveableWidget scene="brb" id="musicWidget" label="Music Widget">
              <MusicWidget glass />
            </MoveableWidget>
          )}
          {(on(config, "latestFollow") || on(config, "chatNote")) && (
            <MoveableWidget scene="brb" id="chatNote" label="Latest Follow / Note">
              <Panel glass style={{ padding: 24 }} className="flex flex-col gap-4">
                {on(config, "latestFollow") && (
                  <div className="flex items-center gap-3.5">
                    <Avatar name={LATEST.follower} size={40} />
                    <div className="flex flex-col gap-1">
                      <SectionLabel accent="var(--nc-primary)">Latest Follower</SectionLabel>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "var(--nc-highlight)" }}>{LATEST.follower}</span>
                    </div>
                    <Heart size={16} color="var(--nc-primary)" strokeWidth={2} className="ml-auto" />
                  </div>
                )}
                {on(config, "latestFollow") && on(config, "chatNote") && <Divider />}
                {on(config, "chatNote") && (
                  <div className="flex items-center gap-3">
                    <MessageCircle size={16} color="var(--nc-accent)" strokeWidth={2} />
                    <span style={{ fontSize: 14, color: "var(--nc-text-2)" }}>{message}</span>
                  </div>
                )}
              </Panel>
            </MoveableWidget>
          )}
          {on(config, "socialLinks") && (
            <MoveableWidget scene="brb" id="socialLinks" label="Social Links">
              <Panel glass style={{ padding: "18px 24px" }}>
                <SocialBar vertical enabled={config.social} />
              </Panel>
            </MoveableWidget>
          )}
          <span style={{ fontSize: 14, color: "var(--nc-text-3)", letterSpacing: "0.04em", textAlign: "center" }}>
            {thanks}
          </span>
        </motion.div>
      )}
    </div>
  );
}
