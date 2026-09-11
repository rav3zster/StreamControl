import { Panel, SectionLabel, Divider, HudCorner } from "../primitives";
import { VTuberStudio } from "../VTuberStudio";
import { ChatPanel } from "../ChatPanel";
import { EventList, GoalBar, AlertFrame } from "../widgets";
import { MusicWidget } from "../MusicWidget";
import { TopStrip, LowerThird } from "../chrome";
import { useClock } from "../useTimers";
import { GOALS, LATEST, MATCH } from "../data";
import type { SceneConfig } from "../../../store/broadcastStore";
import { on, pick } from "../sceneConfig";
import { MoveableWidget } from "../MoveableWidget";

// ============================================================================
// SCENE 02 — Live Gameplay
// Top strip · left keyable gameplay + lower-third · right rail (VTuber, chat,
// goals) · far-right events + latest stats. 8px grid throughout.
//
// OBS: the gameplay region is a SOLID CHROMA GREEN (#00FF00) placeholder with
// no artwork/gradients/textures, inset with a transparent safe margin so the
// keyed capture never touches the frame border.
// ============================================================================

function LatestStat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <div className="flex flex-col gap-2">
      <SectionLabel accent={accent}>{label}</SectionLabel>
      <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--nc-highlight)", lineHeight: 1 }}>
        {value}
      </span>
      {sub && <span style={{ fontSize: 12, color: "var(--nc-text-3)" }}>{sub}</span>}
    </div>
  );
}

function ChromaRegion() {
  return (
    // transparent safe margin (~18px) so the keyed region floats off the border
    <div className="relative flex-1" style={{ padding: 18, minHeight: 0 }}>
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          background: "#00FF00", // chroma key — keyed out in OBS
          borderRadius: "var(--nc-r-md)",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)",
        }}
      >
        {/* registration ticks + label render on the green for framing only */}
        <HudCorner corner="tl" size={30} color="rgba(0,0,0,0.35)" />
        <HudCorner corner="tr" size={30} color="rgba(0,0,0,0.35)" />
        <HudCorner corner="bl" size={30} color="rgba(0,0,0,0.35)" />
        <HudCorner corner="br" size={30} color="rgba(0,0,0,0.35)" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.28em", color: "rgba(0,0,0,0.55)" }}>
            CHROMA KEY · #00FF00
          </span>
          <span style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", letterSpacing: "0.06em" }}>
            Gameplay capture region · keyed out in OBS
          </span>
        </div>
      </div>
    </div>
  );
}

export function LiveGameplay({ config }: { config: SceneConfig }) {
  const clock = useClock();
  const hasRightRail = on(config, "chat") || on(config, "goalBars");
  const hasFarRail = on(config, "recentEvents") || on(config, "musicWidget") || on(config, "latestStats");
  const hasVtuber = on(config, "vtuber");

  return (
    <div className="relative flex h-full w-full flex-col" style={{ background: "var(--nc-bg)" }}>
      <MoveableWidget scene="live" id="topStrip" label="Top Strip">
        <TopStrip clock={clock} />
      </MoveableWidget>

      <div className="relative flex flex-1 gap-6 p-6" style={{ minHeight: 0 }}>
        {/* MAIN GAMEPLAY STAGE — keyable gameplay + reserved alert zone + lower third + floating VTuber */}
        <div className="relative flex flex-1 flex-col" style={{ minWidth: 0 }}>
          <div className="relative flex flex-1 flex-col" style={{ minHeight: 0 }}>
            {on(config, "gameplayRegion") && (
              <MoveableWidget scene="live" id="gameplayRegion" label="Gameplay Region" className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
                <ChromaRegion />
              </MoveableWidget>
            )}

            {/* Floating VTuber Camera — sits directly over gameplay, freely draggable and resizable */}
            {hasVtuber && (
              <div className="absolute top-6 right-6 z-30 pointer-events-auto">
                <MoveableWidget
                  scene="live"
                  id="vtuber"
                  label="VTuber Frame"
                  style={{ width: 420, height: 265 }}
                  minWidth={200}
                  minHeight={150}
                >
                  <VTuberStudio className="w-full h-full" style={{ height: "100%" }} />
                </MoveableWidget>
              </div>
            )}

            {/* reserved alert zone — bottom-left of gameplay */}
            {on(config, "alerts") && (
              <div className="absolute bottom-8 left-8 z-10">
                <MoveableWidget scene="live" id="alerts" label="Alerts Area">
                  <AlertFrame kind="donation" user={LATEST.donation.user} detail={LATEST.donation.amount} />
                </MoveableWidget>
              </div>
            )}
          </div>
          {on(config, "lowerThird") && (
            <div className="pt-6">
              <MoveableWidget scene="live" id="lowerThird" label="Lower Third">
                <LowerThird
                  game={pick(config, "game", MATCH.game)}
                  rank={pick(config, "rank", MATCH.rank)}
                  objective={pick(config, "objective", MATCH.objective)}
                />
              </MoveableWidget>
            </div>
          )}
        </div>

        {/* RIGHT RAIL — chat + goals (only rendered when chat or goals are enabled) */}
        {hasRightRail && (
          <div className="flex flex-col gap-6 shrink-0" style={{ width: 420 }}>
            {on(config, "chat") && (
              <MoveableWidget scene="live" id="chat" label="Chat Panel" className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
                <ChatPanel glass={false} className="flex-1" style={{ minHeight: 0 }} />
              </MoveableWidget>
            )}
            {on(config, "goalBars") && (
              <MoveableWidget scene="live" id="goalBars" label="Goal Bars">
                <Panel style={{ padding: 24 }} className="flex flex-col gap-5">
                  <GoalBar {...GOALS.follower} accent="var(--nc-primary)" />
                  <Divider />
                  <GoalBar {...GOALS.subscriber} accent="var(--nc-secondary)" />
                </Panel>
              </MoveableWidget>
            )}
          </div>
        )}

        {/* FAR RIGHT — events + latest + music */}
        {hasFarRail && (
          <div className="flex flex-col gap-6 shrink-0" style={{ width: 320 }}>
            {on(config, "recentEvents") && (
              <MoveableWidget scene="live" id="recentEvents" label="Recent Events" className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
                <EventList className="flex-1" />
              </MoveableWidget>
            )}
            {on(config, "musicWidget") && (
              <MoveableWidget scene="live" id="musicWidget" label="Music Widget">
                <MusicWidget />
              </MoveableWidget>
            )}
            {on(config, "latestStats") && (
              <MoveableWidget scene="live" id="latestStats" label="Latest Stats">
                <Panel style={{ padding: 24 }} className="grid grid-cols-2 gap-x-6 gap-y-6">
                  <LatestStat label="Latest Follow" value={LATEST.follower} accent="var(--nc-primary)" />
                  <LatestStat label="Latest Sub" value={LATEST.subscriber} sub="Tier 2" accent="var(--nc-secondary)" />
                  <LatestStat label="Latest Tip" value={LATEST.donation.amount} sub={LATEST.donation.user} accent="var(--nc-accent)" />
                  <LatestStat label="Top Donator" value={LATEST.topDonator.amount} sub={LATEST.topDonator.user} accent="var(--nc-primary)" />
                </Panel>
              </MoveableWidget>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
