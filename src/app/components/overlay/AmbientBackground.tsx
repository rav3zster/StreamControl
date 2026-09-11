import { motion } from "motion/react";
import { useActiveTheme, type ThemeId } from "../../store/useBroadcast";

// ============================================================================
// AmbientBackground — Dynamic atmospheric bed behind broadcast scenes.
// Automatically responds to the active theme (Cyber Esports, Neobrutalism,
// Minimal Zen, Synthwave Sunset), providing distinct animations and geometry.
// ============================================================================

// --- Cyber Esports Background ------------------------------------------------
const CYBER_PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: (i * 47) % 100,
  y: (i * 71) % 100,
  s: 1.5 + ((i * 13) % 3),
  d: 8 + ((i * 7) % 10),
  delay: (i % 9) * 0.7,
}));

function CyberBackground({ animated = true }: { animated?: boolean }) {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0c0e15 0%, var(--nc-bg) 45%, #08090d 100%)",
        }}
      />

      {/* Blueprint grid */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(120% 90% at 50% 40%, #000 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(120% 90% at 50% 40%, #000 40%, transparent 100%)",
        }}
        animate={animated ? { backgroundPosition: ["0px 0px", "64px 64px"] } : undefined}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating dust */}
      {animated &&
        CYBER_PARTICLES.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, background: "rgba(255,255,255,0.5)" }}
            animate={{ y: [0, -26, 0], opacity: [0, 0.5, 0] }}
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}

      {/* Scanning laser line */}
      {animated && (
        <motion.div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            height: 140,
            background: "linear-gradient(180deg, transparent, rgba(79,140,255,0.07), transparent)",
          }}
          animate={{ top: ["-15%", "110%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
        />
      )}

      {/* Cyan light ray */}
      {animated && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 2,
            top: 0,
            bottom: 0,
            background: "linear-gradient(180deg, transparent, rgba(0,229,255,0.15), transparent)",
          }}
          animate={{ left: ["12%", "78%", "12%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Drifting radial brand auras */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 900,
          height: 900,
          left: -180,
          top: -220,
          background: "radial-gradient(circle, rgba(79,140,255,0.16), transparent 62%)",
          filter: "blur(20px)",
        }}
        animate={animated ? { x: [0, 60, 0], y: [0, 40, 0] } : undefined}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 820,
          height: 820,
          right: -160,
          bottom: -240,
          background: "radial-gradient(circle, rgba(123,97,255,0.15), transparent 62%)",
          filter: "blur(20px)",
        }}
        animate={animated ? { x: [0, -50, 0], y: [0, -30, 0] } : undefined}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

// --- Neobrutalism Pop Background ---------------------------------------------
const MEMPHIS_SHAPES = [
  { id: 1, type: "box", color: "#fde047", size: 48, x: 10, y: 15, rot: 15, dur: 12 },
  { id: 2, type: "circle", color: "#ff5376", size: 54, x: 88, y: 18, rot: 0, dur: 14 },
  { id: 3, type: "pill", color: "#38bdf8", size: 68, x: 85, y: 78, rot: -20, dur: 16 },
  { id: 4, type: "cross", color: "#fde047", size: 36, x: 12, y: 82, rot: 45, dur: 10 },
  { id: 5, type: "box", color: "#ffffff", size: 40, x: 48, y: 8, rot: -10, dur: 13 },
  { id: 6, type: "circle", color: "#a855f7", size: 44, x: 92, y: 45, rot: 0, dur: 15 },
  { id: 7, type: "cross", color: "#ff5376", size: 32, x: 6, y: 48, rot: 15, dur: 11 },
];

function NeobrutalismBackground({ animated = true }: { animated?: boolean }) {
  return (
    <>
      {/* High-contrast solid dark base */}
      <div className="absolute inset-0" style={{ background: "#18181b" }} />

      {/* Pop dot matrix grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(253, 224, 71, 0.22) 2px, transparent 2px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Bold diagonal comic accent stripe across corner */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 pointer-events-none opacity-25"
        style={{
          background: "repeating-linear-gradient(45deg, #000 0, #000 12px, #fde047 12px, #fde047 24px)",
          transform: "rotate(15deg)",
          border: "4px solid #000",
        }}
      />

      {/* Floating Memphis shapes with thick black outlines */}
      {MEMPHIS_SHAPES.map((s) => (
        <motion.div
          key={s.id}
          className="absolute pointer-events-none flex items-center justify-center font-black"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.type === "pill" ? s.size * 0.48 : s.size,
            borderRadius: s.type === "circle" ? "999px" : s.type === "pill" ? "999px" : s.type === "box" ? "6px" : "0px",
            background: s.type === "cross" ? "transparent" : s.color,
            border: s.type === "cross" ? "none" : "3.5px solid #000000",
            boxShadow: s.type === "cross" ? "none" : "4px 4px 0px #000000",
            color: s.color,
            fontSize: s.size,
          }}
          animate={
            animated
              ? {
                  y: [0, -18, 0],
                  rotate: [s.rot, s.rot + 15, s.rot],
                }
              : undefined
          }
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut" }}
        >
          {s.type === "cross" && "+"}
        </motion.div>
      ))}

      {/* Stark bottom vignette border */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: 12,
          background: "#fde047",
          borderTop: "3.5px solid #000",
        }}
      />
    </>
  );
}

// --- Minimal Zen Background --------------------------------------------------
function MinimalZenBackground({ animated = true }: { animated?: boolean }) {
  return (
    <>
      {/* Deep matte obsidian */}
      <div className="absolute inset-0" style={{ background: "#08090c" }} />

      {/* Ultra-subtle tranquil microdot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(circle at 50% 50%, #000 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 60%, transparent 100%)",
        }}
      />

      {/* Soft warm breathing amber mist */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 1000,
          height: 650,
          left: "20%",
          top: "15%",
          background: "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.045), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={animated ? { scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] } : undefined}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Slate cold mist */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 800,
          height: 500,
          right: "10%",
          bottom: "10%",
          background: "radial-gradient(ellipse at center, rgba(148, 163, 184, 0.035), transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={animated ? { scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] } : undefined}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

// --- Synthwave Sunset Background ---------------------------------------------
const RETRO_STARS = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: (i * 37) % 100,
  y: (i * 23) % 55,
  size: 1 + (i % 3),
  blinkDelay: (i % 5) * 0.6,
}));

function SynthwaveBackground({ animated = true }: { animated?: boolean }) {
  return (
    <>
      {/* 80s deep purple sky */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #090314 0%, #15062b 50%, #2e0847 100%)",
        }}
      />

      {/* Retro twinkling stars */}
      {animated &&
        RETRO_STARS.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              background: "#ffffff",
              boxShadow: "0 0 6px rgba(255, 255, 255, 0.8)",
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2.5 + (star.id % 3), repeat: Infinity, ease: "easeInOut", delay: star.blinkDelay }}
          />
        ))}

      {/* Glowing synthwave sun on horizon */}
      <div
        className="absolute left-1/2 pointer-events-none -translate-x-1/2"
        style={{
          bottom: "28%",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "linear-gradient(180deg, #ffbe0b 0%, #ff2a85 65%, transparent 100%)",
          boxShadow: "0 0 100px rgba(255, 42, 133, 0.6), 0 0 180px rgba(255, 190, 11, 0.4)",
          maskImage: "linear-gradient(180deg, #000 0%, #000 45%, transparent 46%, #000 50%, transparent 51%, #000 58%, transparent 59%, #000 70%, transparent 72%, #000 86%, transparent 88%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 45%, transparent 46%, #000 50%, transparent 51%, #000 58%, transparent 59%, #000 70%, transparent 72%, #000 86%, transparent 88%)",
        }}
      />

      {/* 3D Perspective Rolling Wireframe Horizon Floor */}
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none"
        style={{
          height: "46%",
          perspective: "360px",
          perspectiveOrigin: "50% 0%",
        }}
      >
        <motion.div
          className="absolute inset-x-0 top-0 h-[240%]"
          style={{
            transform: "rotateX(72deg)",
            transformOrigin: "50% 0%",
            backgroundImage:
              "linear-gradient(rgba(5, 217, 232, 0.45) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255, 42, 133, 0.5) 1.5px, transparent 1.5px)",
            backgroundSize: "60px 45px",
            boxShadow: "inset 0 100px 80px -20px #090314",
          }}
          animate={animated ? { backgroundPosition: ["0px 0px", "0px 45px"] } : undefined}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Horizon neon laser beam */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          bottom: "46%",
          height: 2,
          background: "linear-gradient(90deg, transparent 0%, #05d9e8 25%, #ff2a85 50%, #05d9e8 75%, transparent 100%)",
          boxShadow: "0 0 18px #ff2a85, 0 0 35px #05d9e8",
        }}
      />

      {/* Scanline CRT overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.18) 50%, transparent 50%)",
          backgroundSize: "100% 4px",
        }}
      />
    </>
  );
}

// --- Main AmbientBackground Wrapper ------------------------------------------
export function AmbientBackground({
  grid = true,
  animated = true,
  theme: themeOverride,
}: {
  grid?: boolean;
  animated?: boolean;
  theme?: ThemeId;
}) {
  const activeTheme = useActiveTheme();
  const theme = themeOverride || activeTheme;

  return (
    <div className="absolute inset-0 overflow-hidden" data-theme={theme} style={{ background: "var(--nc-bg)" }}>
      {theme === "neobrutalism" && <NeobrutalismBackground animated={animated} />}
      {theme === "minimal-zen" && <MinimalZenBackground animated={animated} />}
      {theme === "synthwave-sunset" && <SynthwaveBackground animated={animated} />}
      {theme === "cyber-esports" && <CyberBackground animated={animated} />}

      {/* Faint overall edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow:
            theme === "neobrutalism"
              ? "inset 0 0 100px rgba(0,0,0,0.4)"
              : "inset 0 0 320px 40px rgba(0,0,0,0.6)",
        }}
      />
    </div>
  );
}
