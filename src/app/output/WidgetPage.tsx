import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { Panel, Divider } from "../components/overlay/primitives";
import { ChatPanel } from "../components/overlay/ChatPanel";
import { MusicWidget } from "../components/overlay/MusicWidget";
import { EventList, GoalBar, SocialBar } from "../components/overlay/widgets";
import { GOALS } from "../components/overlay/data";

// ============================================================================
// Widget pages — standalone, transparent, single-widget OBS Browser Sources.
// Size the browser source to the widget; everything else is transparent so it
// composites cleanly over gameplay.
// ============================================================================

function useTransparentBody() {
  useEffect(() => {
    document.body.style.background = "transparent";
    document.documentElement.style.background = "transparent";
    return () => {
      document.body.style.background = "";
      document.documentElement.style.background = "";
    };
  }, []);
}

const WIDGETS: Record<string, { w: number; render: () => React.ReactNode }> = {
  chat: { w: 420, render: () => <ChatPanel style={{ height: "100%" }} /> },
  music: { w: 420, render: () => <MusicWidget glass /> },
  events: { w: 360, render: () => <EventList /> },
  goals: {
    w: 460,
    render: () => (
      <Panel style={{ padding: 24 }} className="flex flex-col gap-5">
        <GoalBar {...GOALS.follower} accent="var(--nc-primary)" />
        <Divider />
        <GoalBar {...GOALS.subscriber} accent="var(--nc-secondary)" />
      </Panel>
    ),
  },
  social: {
    w: 640,
    render: () => (
      <Panel glass style={{ padding: "18px 28px" }}>
        <SocialBar />
      </Panel>
    ),
  },
};

export function WidgetPage() {
  const { widget } = useParams();
  useTransparentBody();
  const entry = widget ? WIDGETS[widget] : undefined;

  if (!entry) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-3" style={{ background: "var(--nc-bg)", fontFamily: "var(--nc-font)" }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: "var(--nc-highlight)" }}>Unknown widget</span>
        <span style={{ fontSize: 14, color: "var(--nc-text-3)" }}>Try chat, music, events, goals or social.</span>
        <Link to="/" style={{ fontSize: 13, color: "var(--nc-primary)" }}>← Back to editor</Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 p-6" style={{ background: "transparent", fontFamily: "var(--nc-font)" }}>
      <div style={{ width: entry.w, maxWidth: "100%", height: "100%", maxHeight: "100%" }}>{entry.render()}</div>
    </div>
  );
}
