import { motion } from "motion/react";
import { AmbientBackground } from "../AmbientBackground";
import { VTuberStudio } from "../VTuberStudio";
import { ChatPanel } from "../ChatPanel";
import { GoalBar, SponsorBanner } from "../widgets";
import { MusicWidget } from "../MusicWidget";
import { Wordmark, SectionLabel, Panel, Metric } from "../primitives";
import { useClock } from "../useTimers";
import { GOALS } from "../data";
import type { SceneConfig } from "../../../store/broadcastStore";
import { on, pick } from "../sceneConfig";
import { MoveableWidget } from "../MoveableWidget";
import { StyledText } from "../StyledText";

// ============================================================================
// SCENE 03 — Just Chatting
// A large webcam takes the stage, a tall chat column on the right, a slim
// events/goal strip below. Airy, soft, lots of breathing room.
// Blocks + topic copy are data-driven; disabling a block reflows the columns.
// ============================================================================

export function JustChatting({ config }: { config: SceneConfig }) {
  const clock = useClock();
  const topic = pick(config, "topic", "Q&A · Setup Tour · Community Games");
  const hasChatCol = on(config, "chat") || on(config, "musicWidget");
  const hasBottom = on(config, "recentEvents") || on(config, "goalBars");

  return (
    <div className="relative h-full w-full">
      <AmbientBackground animated={config.animations} />

      {/* header */}
      <MoveableWidget scene="chatting" id="header" label="Scene Header" className="absolute inset-x-16 top-10 z-20 flex items-center justify-between">
        <Wordmark size={56} />
        <div className="flex items-center gap-6">
          <SectionLabel accent="var(--nc-accent)">Just Chatting</SectionLabel>
          <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.14em", color: "var(--nc-text-2)", fontVariantNumeric: "tabular-nums" }}>{clock}</span>
        </div>
      </MoveableWidget>

      {/* main split */}
      <div className="absolute inset-x-16 z-20 flex gap-8" style={{ top: 128, bottom: hasBottom ? 156 : 56 }}>
        {/* VTuber stage — the room takes ~75% of the width, cozy and large */}
        <div className="flex flex-1 flex-col gap-6" style={{ minWidth: 0 }}>
          {on(config, "vtuber") && (
            <MoveableWidget scene="chatting" id="vtuber" label="VTuber Stage" className="flex-1 flex flex-col">
              <VTuberStudio className="flex-1" role="Live · Community Hangout" />
            </MoveableWidget>
          )}
          {(on(config, "topic") || on(config, "sponsor")) && (
            <MoveableWidget scene="chatting" id="topic" label="Topic Panel">
              <Panel style={{ padding: 24 }} className="flex items-center justify-between">
                {on(config, "topic") && (
                  <div className="flex flex-col gap-2">
                    <SectionLabel>Topic</SectionLabel>
                    <StyledText
                      text={topic}
                      styleConfig={config.contentStyles?.["topic"]}
                      defaultStyle={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--nc-highlight)" }}
                    />
                  </div>
                )}
                {on(config, "sponsor") && <SponsorBanner />}
              </Panel>
            </MoveableWidget>
          )}
        </div>

        {/* chat column */}
        {hasChatCol && (
          <div className="flex flex-col gap-6" style={{ width: 400 }}>
            {on(config, "chat") && (
              <MoveableWidget scene="chatting" id="chat" label="Chat Panel" className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
                <ChatPanel className="flex-1" style={{ minHeight: 0 }} />
              </MoveableWidget>
            )}
            {on(config, "musicWidget") && (
              <MoveableWidget scene="chatting" id="musicWidget" label="Music Widget">
                <MusicWidget glass />
              </MoveableWidget>
            )}
          </div>
        )}
      </div>

      {/* bottom strip: events + goal */}
      {hasBottom && (
        <div className="absolute inset-x-16 bottom-14 z-20 flex items-center gap-6">
          {on(config, "recentEvents") && (
            <MoveableWidget scene="chatting" id="recentEvents" label="Recent Events">
              <Panel glass style={{ padding: "16px 24px" }} className="flex items-center gap-8">
                <Metric label="Recent Events" value="42 today" accent="var(--nc-accent)" size={22} />
              </Panel>
            </MoveableWidget>
          )}
          {on(config, "goalBars") && (
            <MoveableWidget scene="chatting" id="goalBars" label="Goal Bars" className="flex-1">
              <Panel glass style={{ padding: "20px 28px", width: "100%" }}>
                <GoalBar {...GOALS.follower} accent="var(--nc-primary)" />
              </Panel>
            </MoveableWidget>
          )}
        </div>
      )}

      {/* soft accent orbit — one small decorative motion, kept minimal */}
      {config.animations && (
        <motion.span
          className="absolute z-10 rounded-full"
          style={{ width: 10, height: 10, background: "var(--nc-accent)", left: "52%", top: "22%", filter: "blur(1px)" }}
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
    </div>
  );
}
