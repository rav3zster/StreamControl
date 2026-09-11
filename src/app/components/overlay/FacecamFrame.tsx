import { SafeImage } from "./SafeImage";
import { HudCorner, LiveDot, LogoIcon } from "./primitives";

// ============================================================================
// FacecamFrame — the webcam housing. Thin brand-edged frame, corner ticks,
// a quiet identity strip along the bottom. Reusable at any size.
// ============================================================================

const FACE_SRC =
  "https://images.unsplash.com/photo-1610041321461-37a7d578ebad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

export function FacecamFrame({
  name = "AXIOM",
  role = "Duelist · Radiant",
  live = true,
  className = "",
  style,
}: {
  name?: string;
  role?: string;
  live?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius: "var(--nc-r-lg)",
        border: "1px solid var(--nc-line-strong)",
        boxShadow: "var(--nc-shadow)",
        background: "var(--nc-panel)",
        ...style,
      }}
    >
      {/* top brand hairline */}
      <div
        className="absolute inset-x-0 top-0 z-20"
        style={{ height: 2, background: "linear-gradient(90deg, var(--nc-primary), var(--nc-secondary))" }}
      />
      <SafeImage
        src={FACE_SRC}
        alt={`${name} facecam`}
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: "cover" }}
      />
      {/* readability scrim */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: "linear-gradient(180deg, transparent 55%, rgba(8,9,13,0.92) 100%)" }}
      />

      <div className="pointer-events-none absolute inset-0 z-20">
        <HudCorner corner="tl" color="var(--nc-line-brand)" />
        <HudCorner corner="tr" color="var(--nc-line-brand)" />
        <HudCorner corner="bl" />
        <HudCorner corner="br" />
      </div>

      {live && (
        <div className="absolute left-4 top-4 z-20">
          <LiveDot />
        </div>
      )}

      {/* R3 icon watermark — top right */}
      <div className="absolute right-4 top-3 z-20">
        <LogoIcon size={44} />
      </div>

      {/* identity strip */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 px-5 pb-4 pt-8">
        <span style={{ width: 3, height: 26, borderRadius: 2, background: "linear-gradient(var(--nc-primary), var(--nc-secondary))" }} />
        <div className="flex flex-col">
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--nc-highlight)", lineHeight: 1.1 }}>
            {name}
          </span>
          <span style={{ fontSize: 11.5, color: "var(--nc-text-2)", letterSpacing: "0.02em" }}>{role}</span>
        </div>
      </div>
    </div>
  );
}
