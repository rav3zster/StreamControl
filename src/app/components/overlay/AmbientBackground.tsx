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

// --- Glassmorphism & Translucent Liquid Glass Background ---------------------
const GLASS_PRISMS = [
  { id: 1, x: 10, y: 15, size: 76, dur: 18, delay: 0 },
  { id: 2, x: 88, y: 18, size: 92, dur: 22, delay: 1.5 },
  { id: 3, x: 82, y: 74, size: 68, dur: 16, delay: 3 },
  { id: 4, x: 14, y: 76, size: 84, dur: 24, delay: 0.8 },
  { id: 5, x: 50, y: 88, size: 60, dur: 20, delay: 2 },
];

function GlassmorphismBackground({ animated = true }: { animated?: boolean }) {
  return (
    <>
      {/* Deep obsidian glass base */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(120% 100% at 50% 10%, #0d162e 0%, #060813 60%, #020308 100%)",
        }}
      />

      {/* Floating liquid aurora flares */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 750,
          height: 750,
          left: "5%",
          top: "-15%",
          background: "radial-gradient(circle, rgba(79,172,254,0.18) 0%, rgba(0,242,254,0.12) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={animated ? { x: [0, 50, 0], y: [0, 40, 0], scale: [1, 1.1, 1] } : undefined}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 820,
          height: 820,
          right: "2%",
          bottom: "-15%",
          background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(79,172,254,0.1) 45%, transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={animated ? { x: [0, -60, 0], y: [0, -30, 0], scale: [1, 1.08, 1] } : undefined}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Micro-dot frosted glass grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at 50% 50%, #000 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, #000 40%, transparent 80%)",
        }}
      />

      {/* 3D Floating Translucent Glass Prisms */}
      {GLASS_PRISMS.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            perspective: 800,
          }}
          animate={animated ? { y: [0, -22, 0] } : undefined}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        >
          <motion.div
            style={{
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              borderRadius: p.size * 0.28,
              background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(79,172,254,0.1) 40%, rgba(0,242,254,0.18) 100%)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              boxShadow: "0 20px 40px rgba(0, 242, 254, 0.22), inset 0 0 16px rgba(255,255,255,0.35)",
            }}
            animate={animated ? { rotateX: [0, 360], rotateY: [0, 360], rotateZ: [0, 180] } : undefined}
            transition={{ duration: p.dur, repeat: Infinity, ease: "linear" }}
          >
            {/* Specular light facet */}
            <div
              style={{
                position: "absolute",
                inset: "15%",
                borderRadius: p.size * 0.18,
                background: "linear-gradient(225deg, rgba(255,255,255,0.45) 0%, transparent 65%)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}

// --- Cozy Cottagecore & Lofi Room Background ---------------------------------
const BOTANICAL_LEAVES = [
  { id: 1, x: 6, y: 18, size: 58, rot: 35, dur: 7, delay: 0 },
  { id: 2, x: 92, y: 22, size: 50, rot: -40, dur: 8, delay: 1.5 },
  { id: 3, x: 86, y: 78, size: 64, rot: 15, dur: 9, delay: 0.8 },
  { id: 4, x: 10, y: 75, size: 54, rot: -25, dur: 7.5, delay: 2 },
  { id: 5, x: 48, y: 6, size: 44, rot: 8, dur: 6.5, delay: 3 },
];

const GOLDEN_MOTES = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  x: (i * 39) % 100,
  y: (i * 67) % 100,
  size: 2 + (i % 3),
  dur: 9 + (i % 8),
  delay: (i % 7) * 0.7,
}));

function CottagecoreBackground({ animated = true }: { animated?: boolean }) {
  return (
    <>
      {/* Warm cedar & matcha earthy base */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(120% 90% at 50% 30%, #261c15 0%, #19130e 65%, #120d09 100%)",
        }}
      />

      {/* Warm fireplace ambient hearth glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 850,
          height: 600,
          left: "20%",
          top: "10%",
          background: "radial-gradient(ellipse, rgba(224,122,95,0.12) 0%, rgba(254,250,224,0.06) 45%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={animated ? { opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] } : undefined}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating warm golden dust motes */}
      {animated &&
        GOLDEN_MOTES.map((mote) => (
          <motion.span
            key={mote.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${mote.x}%`,
              top: `${mote.y}%`,
              width: mote.size,
              height: mote.size,
              background: "#fefae0",
              boxShadow: "0 0 6px rgba(254, 250, 224, 0.7)",
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, (mote.id % 2 === 0 ? 8 : -8), 0],
              opacity: [0.1, 0.85, 0.1],
            }}
            transition={{
              duration: mote.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: mote.delay,
            }}
          />
        ))}

      {/* 3D Swaying Botanical Fern/Ivy Leaves */}
      {BOTANICAL_LEAVES.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute pointer-events-none"
          style={{
            left: `${leaf.x}%`,
            top: `${leaf.y}%`,
            width: leaf.size,
            height: leaf.size,
            transformOrigin: "bottom left",
          }}
          animate={
            animated
              ? {
                  rotate: [leaf.rot - 8, leaf.rot + 8, leaf.rot - 8],
                  y: [0, -8, 0],
                }
              : { rotate: leaf.rot }
          }
          transition={{
            duration: leaf.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: leaf.delay,
          }}
        >
          {/* Stylized SVG Leaf */}
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-md">
            <path
              d="M12 40C12 40 10 24 24 10C38 24 36 40 36 40C36 40 26 36 24 28C22 36 12 40 12 40Z"
              fill="rgba(132, 169, 140, 0.35)"
              stroke="#84a98c"
              strokeWidth="2"
            />
            <path d="M24 10V38" stroke="#84a98c" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M24 20L30 16" stroke="#84a98c" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M24 26L18 22" stroke="#84a98c" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </motion.div>
      ))}

      {/* Subtle Vinyl Turntable Groove Rings on Corner */}
      <div
        className="absolute -bottom-36 -left-36 w-[420px] h-[420px] rounded-full pointer-events-none opacity-20 border border-[rgba(254,250,224,0.3)]"
        style={{
          boxShadow:
            "0 0 0 20px rgba(0,0,0,0.4), 0 0 0 45px rgba(254,250,224,0.08), 0 0 0 70px rgba(0,0,0,0.3), 0 0 0 95px rgba(254,250,224,0.06)",
        }}
      />
    </>
  );
}

// --- Retro 8-Bit Arcade Background -------------------------------------------
const ARCADE_PIXELS = [
  { id: 1, type: "coin", x: 12, y: 16, dur: 4 },
  { id: 2, type: "star", x: 86, y: 18, dur: 3.5 },
  { id: 3, type: "alien", x: 88, y: 80, dur: 5 },
  { id: 4, type: "star", x: 14, y: 82, dur: 3 },
  { id: 5, type: "coin", x: 48, y: 8, dur: 4.5 },
];

function RetroArcadeBackground({ animated = true }: { animated?: boolean }) {
  return (
    <>
      {/* Deep phosphor arcade black base */}
      <div className="absolute inset-0" style={{ background: "#0a0518" }} />

      {/* 3D Perspective Wireframe Horizon Floor */}
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none"
        style={{
          height: "44%",
          perspective: "320px",
          perspectiveOrigin: "50% 0%",
        }}
      >
        <motion.div
          className="absolute inset-x-0 top-0 h-[220%]"
          style={{
            transform: "rotateX(70deg)",
            transformOrigin: "50% 0%",
            backgroundImage:
              "linear-gradient(rgba(255, 215, 0, 0.45) 2px, transparent 2px), linear-gradient(90deg, rgba(57, 255, 20, 0.4) 2px, transparent 2px)",
            backgroundSize: "48px 40px",
            boxShadow: "inset 0 80px 60px -10px #0a0518",
          }}
          animate={animated ? { backgroundPosition: ["0px 0px", "0px 40px"] } : undefined}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Horizon neon gold laser beam */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          bottom: "44%",
          height: 2,
          background: "linear-gradient(90deg, transparent 0%, #ffd700 25%, #39ff14 50%, #ffd700 75%, transparent 100%)",
          boxShadow: "0 0 16px #ffd700, 0 0 30px #39ff14",
        }}
      />

      {/* 3D Floating Wireframe Arcade Cube */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          right: "12%",
          top: "22%",
          width: 60,
          height: 60,
          perspective: 600,
        }}
        animate={animated ? { y: [0, -18, 0] } : undefined}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            border: "2px solid #ffd700",
            background: "rgba(255, 215, 0, 0.12)",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 10px rgba(57, 255, 20, 0.3)",
          }}
          animate={animated ? { rotateX: [0, 360], rotateY: [0, 360] } : undefined}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Floating 8-Bit Pixel Sprites */}
      {ARCADE_PIXELS.map((item) => (
        <motion.div
          key={item.id}
          className="absolute pointer-events-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: 28,
            height: 28,
          }}
          animate={animated ? { y: [0, -12, 0] } : undefined}
          transition={{ duration: item.dur, repeat: Infinity, ease: "easeInOut" }}
        >
          {item.type === "coin" && (
            <div
              className="w-6 h-6 rounded-full border-2 border-[#ffd700] bg-[#ffd700]/20 flex items-center justify-center text-[10px] font-mono font-black text-[#ffd700]"
              style={{ boxShadow: "0 0 10px #ffd700" }}
            >
              $
            </div>
          )}
          {item.type === "star" && (
            <div
              className="w-5 h-5 bg-[#39ff14] rotate-45 border border-white"
              style={{ boxShadow: "0 0 12px #39ff14" }}
            />
          )}
          {item.type === "alien" && (
            <svg viewBox="0 0 16 16" fill="#00ffff" className="w-6 h-6 drop-shadow-[0_0_8px_#00ffff]">
              <rect x="4" y="2" width="8" height="2" />
              <rect x="2" y="4" width="12" height="6" />
              <rect x="0" y="6" width="16" height="4" />
              <rect x="2" y="10" width="4" height="4" />
              <rect x="10" y="10" width="4" height="4" />
              <rect x="4" y="6" width="2" height="2" fill="#0a0518" />
              <rect x="10" y="6" width="2" height="2" fill="#0a0518" />
            </svg>
          )}
        </motion.div>
      ))}

      {/* CRT RGB Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.22) 50%, transparent 50%)",
          backgroundSize: "100% 4px",
        }}
      />
    </>
  );
}

// --- Cyber Glitch & Matrix Anomaly Background --------------------------------
const GLITCH_COLUMNS = [
  { id: 1, x: 6, chars: "01011001", speed: 8 },
  { id: 2, x: 18, chars: "7F0A4B12", speed: 11 },
  { id: 3, x: 30, chars: "10110100", speed: 7 },
  { id: 4, x: 68, chars: "FF0055AA", speed: 9 },
  { id: 5, x: 82, chars: "00FF6601", speed: 12 },
  { id: 6, x: 94, chars: "11001010", speed: 6 },
];

function CyberGlitchBackground({ animated = true }: { animated?: boolean }) {
  return (
    <>
      {/* Void matrix black base */}
      <div className="absolute inset-0" style={{ background: "#030906" }} />

      {/* Falling Binary Data Rain Columns */}
      {animated &&
        GLITCH_COLUMNS.map((col) => (
          <motion.div
            key={col.id}
            className="absolute pointer-events-none flex flex-col font-mono text-[10px] tracking-widest"
            style={{
              left: `${col.x}%`,
              color: "rgba(0, 255, 102, 0.45)",
              textShadow: "0 0 8px #00ff66",
            }}
            animate={{ top: ["-30%", "110%"] }}
            transition={{ duration: col.speed, repeat: Infinity, ease: "linear" }}
          >
            {col.chars.split("").map((c, i) => (
              <span key={i} style={{ opacity: i === col.chars.length - 1 ? 1 : 0.4 + i * 0.08 }}>
                {c}
              </span>
            ))}
          </motion.div>
        ))}

      {/* 3D Rotating Matrix Tesseract Wireframe */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: "14%",
          top: "24%",
          width: 70,
          height: 70,
          perspective: 700,
        }}
        animate={animated ? { y: [0, -15, 0] } : undefined}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            border: "1.5px solid #00ff66",
            background: "rgba(0, 255, 102, 0.08)",
            boxShadow: "0 0 25px rgba(0, 255, 102, 0.45), inset 0 0 15px rgba(255, 0, 85, 0.3)",
          }}
          animate={animated ? { rotateX: [0, 360], rotateY: [0, 360], rotateZ: [0, 180] } : undefined}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          {/* Inner nested diamond ring */}
          <div
            style={{
              position: "absolute",
              inset: "15%",
              border: "1.5px solid #ff0055",
              boxShadow: "0 0 10px #ff0055",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Corrupted RGB Glitch Flare Glows */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 800,
          height: 600,
          right: "-10%",
          top: "10%",
          background: "radial-gradient(circle, rgba(0,255,102,0.12) 0%, rgba(255,0,85,0.08) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={animated ? { scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] } : undefined}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Periodic horizontal glitch twitch slice */}
      {animated && (
        <motion.div
          className="absolute inset-x-0 pointer-events-none opacity-20"
          style={{
            height: 3,
            background: "linear-gradient(90deg, #ff0055, #00ff66, #ffaa00)",
            boxShadow: "0 0 12px #ff0055",
          }}
          animate={{
            top: ["10%", "85%", "35%", "95%"],
            opacity: [0, 0.6, 0, 0.8, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Digital Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(0,255,102,0.06) 1px, transparent 1px)",
          backgroundSize: "100% 3px",
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
      {theme === "glassmorphism" && <GlassmorphismBackground animated={animated} />}
      {theme === "cottagecore-lofi" && <CottagecoreBackground animated={animated} />}
      {theme === "retro-arcade" && <RetroArcadeBackground animated={animated} />}
      {theme === "cyber-glitch" && <CyberGlitchBackground animated={animated} />}

      {/* Faint overall edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow:
            theme === "neobrutalism"
              ? "inset 0 0 100px rgba(0,0,0,0.4)"
              : theme === "retro-arcade"
              ? "inset 0 0 80px rgba(0,0,0,0.8)"
              : "inset 0 0 320px 40px rgba(0,0,0,0.6)",
        }}
      />
    </div>
  );
}

