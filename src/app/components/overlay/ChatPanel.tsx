import { MessageSquare } from "lucide-react";
import { Panel, SectionLabel, Divider } from "./primitives";
import { CHAT, type ChatMsg } from "./data";

// ============================================================================
// ChatPanel — the live chat surface. Named badges, per-user accent, quiet
// rows with generous line spacing. Glass variant for on-gameplay use.
// ============================================================================

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.08em",
        color,
        padding: "2px 6px",
        borderRadius: 5,
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${color}`,
        lineHeight: 1,
      }}
    >
      {label}
    </span>
  );
}

function Row({ m }: { m: ChatMsg }) {
  return (
    <div className="flex flex-col gap-1.5 py-3.5">
      <div className="flex items-center gap-2">
        {m.badge && <Badge label={m.badge} color={m.color} />}
        <span style={{ fontSize: 14, fontWeight: 700, color: m.color, letterSpacing: "-0.01em", textShadow: `0 0 18px color-mix(in srgb, ${m.color} 45%, transparent)` }}>
          {m.user}
        </span>
      </div>
      <span style={{ fontSize: 14, fontWeight: 400, color: "var(--nc-text)", lineHeight: 1.6 }}>{m.text}</span>
    </div>
  );
}

export function ChatPanel({
  title = "Live Chat",
  messages = CHAT,
  glass = true,
  className = "",
  style,
}: {
  title?: string;
  messages?: ChatMsg[];
  glass?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Panel glass={glass} className={`flex flex-col overflow-hidden ${className}`} style={{ padding: 0, ...style }}>
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <SectionLabel accent="var(--nc-primary)">{title}</SectionLabel>
        <MessageSquare size={15} color="var(--nc-text-3)" strokeWidth={2} />
      </div>
      <Divider />
      <div className="flex flex-1 flex-col overflow-hidden px-6 py-2">
        {messages.map((m, i) => (
          <div key={m.id}>
            {i > 0 && <Divider />}
            <Row m={m} />
          </div>
        ))}
      </div>
      {/* faint fade at top so chat feels like a stream */}
      <div className="pointer-events-none absolute inset-x-0 top-14 h-8" style={{ background: "linear-gradient(var(--nc-panel), transparent)", opacity: glass ? 0 : 1 }} />
    </Panel>
  );
}
