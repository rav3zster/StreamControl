import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { useCustomLogo, useActiveTheme } from "../../store/useBroadcast";

// ============================================================================
// Primitives & HUD — the shared vocabulary every scene is built from.
// All color / radius values reference CSS tokens so the pack retunes from CSS.
// Components adapt their visual styling based on the active theme.
// ============================================================================

/* --- Panel -----------------------------------------------------------------
   The core surface. Hairline stroke, soft depth, generous radius. Optional
   glass treatment for overlays that sit on top of gameplay. By default every
   panel breathes — a barely-there 2px vertical float that makes the pack feel
   like a live control room rather than a static mockup. */
let floatSeed = 0;
export function Panel({
  children,
  className = "",
  style,
  glass = false,
  radius = "lg",
  float = true,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  glass?: boolean;
  radius?: "sm" | "md" | "lg" | "xl";
  float?: boolean;
}) {
  const theme = useActiveTheme();
  const r = { sm: "var(--nc-r-sm)", md: "var(--nc-r-md)", lg: "var(--nc-r-lg)", xl: "var(--nc-r-xl)" }[radius];
  const delay = (floatSeed++ % 5) * 0.6;

  const getBackground = () => {
    if (theme === "neobrutalism") {
      return glass ? "#ffffff" : "var(--nc-panel)";
    }
    if (theme === "synthwave-sunset") {
      return glass ? "rgba(25,11,56,0.85)" : "var(--nc-panel)";
    }
    if (theme === "minimal-zen") {
      return glass ? "rgba(18,22,32,0.7)" : "var(--nc-panel)";
    }
    return glass ? "rgba(18,20,28,0.72)" : "var(--nc-panel)";
  };

  const getBorder = () => {
    if (theme === "neobrutalism") return "3px solid #000000";
    if (theme === "synthwave-sunset") return "1.5px solid rgba(255,42,133,0.45)";
    if (theme === "minimal-zen") return "1px solid rgba(255,255,255,0.08)";
    return "1px solid var(--nc-line)";
  };

  const getShadow = () => {
    if (theme === "neobrutalism") return "4px 4px 0px #000000";
    if (theme === "synthwave-sunset") return "0 0 24px rgba(255,42,133,0.25)";
    return "var(--nc-shadow-soft)";
  };

  const getTextColor = () => {
    if (theme === "neobrutalism") return "#09090b";
    return undefined;
  };

  return (
    <motion.div
      className={className}
      style={{
        background: getBackground(),
        backdropFilter: glass && theme !== "neobrutalism" ? "blur(20px) saturate(120%)" : undefined,
        border: getBorder(),
        borderRadius: r,
        boxShadow: getShadow(),
        color: getTextColor(),
        ...style,
      }}
      animate={float ? { y: [0, -2, 0] } : undefined}
      transition={float ? { duration: 7, repeat: Infinity, ease: "easeInOut", delay } : undefined}
    >
      {children}
    </motion.div>
  );
}

/* --- SectionLabel ----------------------------------------------------------
   Small subtle metadata label. Uppercase, tracked, tertiary text. */
export function SectionLabel({
  children,
  accent,
  className = "",
}: {
  children: ReactNode;
  accent?: string;
  className?: string;
}) {
  const theme = useActiveTheme();
  if (theme === "neobrutalism") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 font-bold uppercase tracking-wider ${className}`}
        style={{
          fontSize: 11,
          background: accent || "#fde047",
          color: "#000000",
          border: "2px solid #000000",
          boxShadow: "2px 2px 0px #000000",
          borderRadius: 4,
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {accent && (
        <span style={{ width: 6, height: 6, borderRadius: 2, background: accent }} />
      )}
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.18em",
          color: "var(--nc-text-3)",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </div>
  );
}

/* --- Divider ---------------------------------------------------------------
   Hairline separator with an optional tick — a quiet HUD signature. */
export function Divider({
  vertical = false,
  className = "",
  tick = false,
}: {
  vertical?: boolean;
  className?: string;
  tick?: boolean;
}) {
  if (vertical) {
    return (
      <div className={`relative ${className}`} style={{ width: 1, background: "var(--nc-line)" }}>
        {tick && (
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: 1, height: 18, background: "var(--nc-primary)" }}
          />
        )}
      </div>
    );
  }
  return (
    <div className={`relative ${className}`} style={{ height: 1, background: "var(--nc-line)" }}>
      {tick && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2"
          style={{ width: 20, height: 1, background: "var(--nc-primary)" }}
        />
      )}
    </div>
  );
}

/* --- HudCorner -------------------------------------------------------------
   Thin L-shaped registration ticks. Purposeful framing, not decoration. */
export function HudCorner({
  corner,
  size = 26,
  color = "var(--nc-line-strong)",
  animated = false,
}: {
  corner: "tl" | "tr" | "bl" | "br";
  size?: number;
  color?: string;
  animated?: boolean;
}) {
  const theme = useActiveTheme();
  if (theme === "neobrutalism") {
    const pos: Record<string, CSSProperties> = {
      tl: { top: 0, left: 0 },
      tr: { top: 0, right: 0 },
      bl: { bottom: 0, left: 0 },
      br: { bottom: 0, right: 0 },
    };
    return (
      <span
        style={{
          position: "absolute",
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size,
          fontWeight: 900,
          color: "#000000",
          userSelect: "none",
          ...pos[corner],
        }}
      >
        +
      </span>
    );
  }

  const base: CSSProperties = { position: "absolute", width: size, height: size };
  const cornerColor = theme === "synthwave-sunset" ? "rgba(5, 217, 232, 0.7)" : color;
  const pos: Record<string, CSSProperties> = {
    tl: { top: 0, left: 0, borderTop: `1.5px solid ${cornerColor}`, borderLeft: `1.5px solid ${cornerColor}`, borderTopLeftRadius: 6 },
    tr: { top: 0, right: 0, borderTop: `1.5px solid ${cornerColor}`, borderRight: `1.5px solid ${cornerColor}`, borderTopRightRadius: 6 },
    bl: { bottom: 0, left: 0, borderBottom: `1.5px solid ${cornerColor}`, borderLeft: `1.5px solid ${cornerColor}`, borderBottomLeftRadius: 6 },
    br: { bottom: 0, right: 0, borderBottom: `1.5px solid ${cornerColor}`, borderRight: `1.5px solid ${cornerColor}`, borderBottomRightRadius: 6 },
  };
  if (!animated) return <span style={{ ...base, ...pos[corner] }} />;
  const delay = { tl: 0, tr: 0.5, br: 1, bl: 1.5 }[corner];
  return (
    <motion.span
      style={{ ...base, ...pos[corner] }}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* --- Avatar ----------------------------------------------------------------
   Deterministic colored initial chip — stands in for viewer profile images. */
export function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  const palette = ["var(--nc-primary)", "var(--nc-secondary)", "var(--nc-accent)"];
  const idx = name.charCodeAt(0) % palette.length;
  const c = palette[idx];
  return (
    <span
      className="flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: `color-mix(in srgb, ${c} 16%, transparent)`,
        border: `1px solid color-mix(in srgb, ${c} 45%, transparent)`,
        color: c,
        fontSize: size * 0.4,
        fontWeight: 700,
        letterSpacing: "0.02em",
      }}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

/* --- Wordmark --------------------------------------------------------------
   Full R3 logo with name — used in scene headers and wherever there is
   enough horizontal breathing room to show the brand properly.
   Supports user-uploaded custom logo with automatic fallback. */
export function Wordmark({ size = 56, className = "" }: { size?: number; className?: string }) {
  const { customLogo } = useCustomLogo();
  const src = customLogo || "/assets/logos/r3-logo-full.png";

  return (
    <img
      src={src}
      alt="Stream Logo"
      className={className}
      style={{
        height: size,
        width: "auto",
        maxHeight: size,
        objectFit: "contain",
        objectPosition: "left center",
        imageRendering: "auto",
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
      }}
    />
  );
}

/* --- LogoIcon --------------------------------------------------------------
   Single-glyph R3 icon — used in compact or square contexts: top strip,
   facecam badges, widget corner marks, etc.
   Supports user-uploaded custom logo with automatic fallback. */
export function LogoIcon({ size = 44, className = "" }: { size?: number; className?: string }) {
  const { customLogo, customLogoIcon } = useCustomLogo();
  const src = customLogoIcon || customLogo || "/assets/logos/r3-logo.png";

  return (
    <img
      src={src}
      alt="Stream Logo"
      className={className}
      style={{
        height: size,
        width: "auto",
        maxHeight: size,
        objectFit: "contain",
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))",
      }}
    />
  );
}

/* --- LiveDot ---------------------------------------------------------------
   Breathing status indicator. The one place cyan earns its keep. */
export function LiveDot({ label = "LIVE" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex" style={{ width: 8, height: 8 }}>
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--nc-accent)" }}
          animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
        <span className="relative rounded-full" style={{ width: 8, height: 8, background: "var(--nc-accent)" }} />
      </span>
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--nc-highlight)" }}>
        {label}
      </span>
    </div>
  );
}

/* --- Metric ----------------------------------------------------------------
   Label over a large tabular figure — the recurring stat block. */
export function Metric({
  label,
  value,
  accent = "var(--nc-primary)",
  size = 30,
}: {
  label: string;
  value: ReactNode;
  accent?: string;
  size?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <SectionLabel accent={accent}>{label}</SectionLabel>
      <span
        style={{
          fontSize: size,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "var(--nc-highlight)",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
    </div>
  );
}
