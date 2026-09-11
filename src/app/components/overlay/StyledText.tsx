import { motion } from "motion/react";
import type { CSSProperties } from "react";
import type { TextStyleConfig } from "../../store/broadcastStore";

// ============================================================================
// StyledText — Renders dynamic content copy (Stream Title, Tagline, Heading, etc.)
// with user-customized typography (font size, custom color, font weight,
// italic, uppercase) and broadcast animations (Marquee ticker, Pulse, Shimmer, Bounce).
// ============================================================================

export function StyledText({
  text,
  styleConfig,
  defaultStyle = {},
  className = "",
}: {
  text: string;
  styleConfig?: TextStyleConfig;
  defaultStyle?: CSSProperties;
  className?: string;
}) {
  if (!text) return null;

  const fontSize = styleConfig?.fontSize ? `${styleConfig.fontSize}px` : defaultStyle.fontSize;
  const color = styleConfig?.color || defaultStyle.color;
  const fontWeight = styleConfig?.fontWeight ?? defaultStyle.fontWeight;
  const fontStyle = styleConfig?.italic !== undefined ? (styleConfig.italic ? "italic" : "normal") : defaultStyle.fontStyle;
  const textTransform = styleConfig?.uppercase !== undefined ? (styleConfig.uppercase ? "uppercase" : "none") : defaultStyle.textTransform;
  const animation = styleConfig?.animation || "none";
  const marqueeSpeed = styleConfig?.marqueeSpeed ?? 14; // seconds

  const combinedStyles: CSSProperties = {
    ...defaultStyle,
    fontSize,
    color,
    fontWeight,
    fontStyle,
    textTransform,
  };

  // --- MARQUEE ANIMATION ----------------------------------------------------
  if (animation === "marquee") {
    return (
      <div
        className={`relative overflow-hidden inline-flex max-w-full items-center ${className}`}
        style={{
          maskImage: "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
        }}
      >
        <motion.div
          className="inline-flex whitespace-nowrap items-center shrink-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: marqueeSpeed, repeat: Infinity, ease: "linear" }}
        >
          <span style={combinedStyles} className="inline-block px-4">
            {text}
          </span>
          <span style={{ color: "var(--nc-primary)", opacity: 0.7 }} className="text-xs">
            ✦
          </span>
          <span style={combinedStyles} className="inline-block px-4">
            {text}
          </span>
          <span style={{ color: "var(--nc-primary)", opacity: 0.7 }} className="text-xs">
            ✦
          </span>
        </motion.div>
      </div>
    );
  }

  // --- PULSE ANIMATION ------------------------------------------------------
  if (animation === "pulse") {
    return (
      <motion.span
        className={`inline-block ${className}`}
        style={combinedStyles}
        animate={{ opacity: [1, 0.45, 1], scale: [1, 1.015, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {text}
      </motion.span>
    );
  }

  // --- SHIMMER ANIMATION ----------------------------------------------------
  if (animation === "shimmer") {
    return (
      <motion.span
        className={`inline-block ${className}`}
        style={{
          ...combinedStyles,
          backgroundImage: `linear-gradient(90deg, ${color || "var(--nc-highlight)"} 0%, #ffffff 40%, ${color || "var(--nc-highlight)"} 80%)`,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        animate={{ backgroundPosition: ["200% center", "-200% center"] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
      >
        {text}
      </motion.span>
    );
  }

  // --- BOUNCE ANIMATION -----------------------------------------------------
  if (animation === "bounce") {
    return (
      <motion.span
        className={`inline-block ${className}`}
        style={combinedStyles}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {text}
      </motion.span>
    );
  }

  // --- STANDARD STATIC TEXT -------------------------------------------------
  return (
    <span className={className} style={combinedStyles}>
      {text}
    </span>
  );
}
