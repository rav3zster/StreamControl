import { motion } from "motion/react";

// ============================================================================
// AmbientBackground — the shared atmospheric bed behind non-gameplay scenes.
// Deep canvas, a faint blueprint grid, and two slow-drifting brand auras.
// Restrained on purpose: no neon, no glow overload — just depth.
// ============================================================================

// Deterministic particle field so it stays stable across renders.
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: (i * 47) % 100,
  y: (i * 71) % 100,
  s: 1.5 + ((i * 13) % 3),
  d: 8 + ((i * 7) % 10),
  delay: (i % 9) * 0.7,
}));

export function AmbientBackground({ grid = true, animated = true }: { grid?: boolean; animated?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "var(--nc-bg)" }}>
      {/* Vertical tonal gradient for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0c0e15 0%, var(--nc-bg) 45%, #08090d 100%)",
        }}
      />

      {/* Fine blueprint grid — barely-there structure, drifting slowly */}
      {grid && (
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
      )}

      {/* Floating dust — almost invisible drifting particles */}
      {animated && PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, background: "rgba(255,255,255,0.5)" }}
          animate={{ y: [0, -26, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}

      {/* Slow scanning line — the control-room signature */}
      {animated && (
        <motion.div
          className="absolute inset-x-0"
          style={{
            height: 140,
            background: "linear-gradient(180deg, transparent, rgba(79,140,255,0.06), transparent)",
          }}
          animate={{ top: ["-15%", "110%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
        />
      )}

      {/* Soft moving light ray */}
      {animated && (
        <motion.div
          className="absolute"
          style={{
            width: 2,
            top: 0,
            bottom: 0,
            background: "linear-gradient(180deg, transparent, rgba(0,229,255,0.14), transparent)",
          }}
          animate={{ left: ["12%", "78%", "12%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Slow drifting brand auras — soft, low opacity */}
      <motion.div
        className="absolute rounded-full"
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
        className="absolute rounded-full"
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

      {/* Faint vignette */}
      <div
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 320px 40px rgba(0,0,0,0.6)" }}
      />
    </div>
  );
}
