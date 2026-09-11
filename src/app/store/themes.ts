import type { SceneId, WidgetTransform } from "./broadcastStore";

export type ThemeId = "cyber-esports" | "neobrutalism" | "minimal-zen" | "synthwave-sunset";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  tagline: string;
  description: string;
  genres: string[];
  swatches: string[];
  bannerGradient: string;
  cssVars: Record<string, string>;
  // Bespoke layout preset per scene for this theme's personality
  layoutPresets: Partial<Record<SceneId, Record<string, WidgetTransform>>>;
}

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  "cyber-esports": {
    id: "cyber-esports",
    name: "Cyber Esports",
    tagline: "High-tech tactical broadcast",
    description: "Laser scanlines, blueprint grids, sharp angled HUD brackets, and electric blue/cyan accents for competitive esports.",
    genres: ["Competitive FPS", "CS2 / Valorant", "League / MOBA", "Major Tournaments"],
    swatches: ["#4f8cff", "#00e5ff", "#7b61ff", "#0a0b10"],
    bannerGradient: "linear-gradient(135deg, #0a0b10 0%, #172038 50%, #4f8cff 100%)",
    cssVars: {
      "--nc-primary": "#4f8cff",
      "--nc-secondary": "#7b61ff",
      "--nc-accent": "#00e5ff",
      "--nc-highlight": "#ffffff",
      "--nc-bg": "#0a0b10",
      "--nc-bg-2": "#0d0e15",
      "--nc-panel": "#12141c",
      "--nc-panel-2": "#171a24",
      "--nc-line": "rgba(255, 255, 255, 0.08)",
      "--nc-line-strong": "rgba(255, 255, 255, 0.16)",
      "--nc-line-brand": "rgba(79, 140, 255, 0.45)",
      "--nc-text": "#f4f6fb",
      "--nc-text-2": "#a6adbf",
      "--nc-text-3": "#5f6678",
      "--nc-r-sm": "10px",
      "--nc-r-md": "16px",
      "--nc-r-lg": "24px",
      "--nc-shadow": "0 24px 60px -24px rgba(0, 0, 0, 0.7)",
      "--nc-shadow-soft": "0 8px 30px -12px rgba(0, 0, 0, 0.55)",
    },
    layoutPresets: {
      starting: {
        header: { x: 0, y: 0, layer: "top" },
        countdown: { x: 0, y: 0, layer: "extreme-top" },
        title: { x: 0, y: 0, layer: "top" },
        info: { x: 0, y: 0, layer: "bottom" },
        socials: { x: 0, y: 0, layer: "bottom" },
      },
      live: {
        scoreboard: { x: 0, y: 0, layer: "top" },
        vtuber: { x: 0, y: 0, w: 340, h: 220, layer: "extreme-top" },
        chat: { x: 0, y: 0, layer: "bottom" },
        goalBars: { x: 0, y: 0, layer: "bottom" },
        socials: { x: 0, y: 0, layer: "bottom" },
      },
      chatting: {
        cam: { x: 0, y: 0, layer: "top" },
        chat: { x: 0, y: 0, layer: "top" },
      },
    },
  },

  "neobrutalism": {
    id: "neobrutalism",
    name: "Neobrutalism Pop",
    tagline: "Bold, punchy, playful contrast",
    description: "Thick 3.5px solid black borders, hard offset drop-shadows, canary yellow & hot coral accents with animated Memphis geometry.",
    genres: ["Casual / Variety", "Indie Games", "Fighting Games", "Creative / Art", "Just Chatting"],
    swatches: ["#fde047", "#ff5376", "#38bdf8", "#18181b"],
    bannerGradient: "linear-gradient(135deg, #fde047 0%, #ff5376 60%, #38bdf8 100%)",
    cssVars: {
      "--nc-primary": "#fde047",
      "--nc-secondary": "#ff5376",
      "--nc-accent": "#38bdf8",
      "--nc-highlight": "#ffffff",
      "--nc-bg": "#18181b",
      "--nc-bg-2": "#27272a",
      "--nc-panel": "#ffffff",
      "--nc-panel-2": "#fef08a",
      "--nc-line": "#000000",
      "--nc-line-strong": "#000000",
      "--nc-line-brand": "#fde047",
      "--nc-text": "#09090b",
      "--nc-text-2": "#27272a",
      "--nc-text-3": "#71717a",
      "--nc-r-sm": "4px",
      "--nc-r-md": "8px",
      "--nc-r-lg": "12px",
      "--nc-shadow": "6px 6px 0px #000000",
      "--nc-shadow-soft": "4px 4px 0px #000000",
    },
    layoutPresets: {
      // Dynamic asymmetrical composition for Neobrutalism
      starting: {
        header: { x: 0, y: -10, layer: "extreme-top" },
        countdown: { x: -28, y: -20, layer: "top" },
        title: { x: 30, y: 15, layer: "top" },
        info: { x: -40, y: 30, layer: "bottom" },
        socials: { x: 0, y: 10, layer: "extreme-top" },
      },
      live: {
        scoreboard: { x: -20, y: 10, layer: "extreme-top" },
        vtuber: { x: -25, y: -20, w: 360, h: 235, layer: "extreme-top" },
        chat: { x: 0, y: 0, layer: "top" },
        goalBars: { x: 10, y: 0, layer: "bottom" },
        socials: { x: 0, y: 0, layer: "top" },
      },
      chatting: {
        cam: { x: -15, y: 10, layer: "top" },
        chat: { x: 15, y: -10, layer: "extreme-top" },
      },
    },
  },

  "minimal-zen": {
    id: "minimal-zen",
    name: "Minimal Zen",
    tagline: "Serene, frosted & typographic",
    description: "Monochrome slate/obsidian palette, warm amber accents, hairline borders, breathing mist aura, and generous negative space.",
    genres: ["Lo-Fi Chill", "Coding / Tech", "IRL & Podcasts", "Chess & Strategy", "Study / Focus"],
    swatches: ["#f59e0b", "#94a3b8", "#e2e8f0", "#090a0f"],
    bannerGradient: "linear-gradient(135deg, #090a0f 0%, #1e2433 60%, #334155 100%)",
    cssVars: {
      "--nc-primary": "#f59e0b",
      "--nc-secondary": "#cbd5e1",
      "--nc-accent": "#38bdf8",
      "--nc-highlight": "#f8fafc",
      "--nc-bg": "#08090c",
      "--nc-bg-2": "#0f1117",
      "--nc-panel": "rgba(20, 24, 33, 0.75)",
      "--nc-panel-2": "rgba(30, 36, 50, 0.65)",
      "--nc-line": "rgba(255, 255, 255, 0.06)",
      "--nc-line-strong": "rgba(255, 255, 255, 0.12)",
      "--nc-line-brand": "rgba(245, 158, 11, 0.4)",
      "--nc-text": "#f1f5f9",
      "--nc-text-2": "#94a3b8",
      "--nc-text-3": "#475569",
      "--nc-r-sm": "12px",
      "--nc-r-md": "18px",
      "--nc-r-lg": "28px",
      "--nc-shadow": "0 20px 50px -20px rgba(0, 0, 0, 0.8)",
      "--nc-shadow-soft": "0 6px 24px -10px rgba(0, 0, 0, 0.5)",
    },
    layoutPresets: {
      // Floating sleek pill layout with airy negative space
      starting: {
        header: { x: 0, y: -20, layer: "top" },
        countdown: { x: 0, y: -35, layer: "extreme-top" },
        title: { x: 0, y: -15, layer: "top" },
        info: { x: 0, y: 10, layer: "bottom" },
        socials: { x: 0, y: 35, layer: "bottom" },
      },
      live: {
        scoreboard: { x: 0, y: -10, layer: "top" },
        vtuber: { x: -10, y: -10, w: 320, h: 200, layer: "extreme-top" },
        chat: { x: 0, y: 0, layer: "bottom" },
        goalBars: { x: 0, y: 15, layer: "bottom" },
        socials: { x: 0, y: 0, layer: "bottom" },
      },
      chatting: {
        cam: { x: 0, y: 0, layer: "top" },
        chat: { x: 0, y: 0, layer: "bottom" },
      },
    },
  },

  "synthwave-sunset": {
    id: "synthwave-sunset",
    name: "Synthwave Sunset",
    tagline: "80s retro neon & arcade glow",
    description: "Perspective wireframe horizon floor, glowing retro sunset, electric neon magenta & cyan glows, and arcade cabinet presence.",
    genres: ["Retro Gaming", "Speedrunning", "Synthwave / Music", "Friday Night Gaming", "Arcade"],
    swatches: ["#ff2a85", "#05d9e8", "#ffbe0b", "#12072b"],
    bannerGradient: "linear-gradient(135deg, #12072b 0%, #400d51 50%, #ff2a85 100%)",
    cssVars: {
      "--nc-primary": "#ff2a85",
      "--nc-secondary": "#05d9e8",
      "--nc-accent": "#ffbe0b",
      "--nc-highlight": "#ffffff",
      "--nc-bg": "#0e051f",
      "--nc-bg-2": "#170a33",
      "--nc-panel": "#190b38",
      "--nc-panel-2": "#24104f",
      "--nc-line": "rgba(255, 42, 133, 0.25)",
      "--nc-line-strong": "rgba(5, 217, 232, 0.4)",
      "--nc-line-brand": "rgba(255, 42, 133, 0.6)",
      "--nc-text": "#fdf4ff",
      "--nc-text-2": "#d8b4fe",
      "--nc-text-3": "#8654a6",
      "--nc-r-sm": "8px",
      "--nc-r-md": "14px",
      "--nc-r-lg": "20px",
      "--nc-shadow": "0 0 40px rgba(255, 42, 133, 0.35)",
      "--nc-shadow-soft": "0 0 20px rgba(5, 217, 232, 0.25)",
    },
    layoutPresets: {
      // Centered arcade cabinet layout with high neon prominence
      starting: {
        header: { x: 0, y: 0, layer: "extreme-top" },
        countdown: { x: 0, y: -10, layer: "extreme-top" },
        title: { x: 0, y: 10, layer: "top" },
        info: { x: 0, y: 25, layer: "bottom" },
        socials: { x: 0, y: 20, layer: "top" },
      },
      live: {
        scoreboard: { x: 0, y: 0, layer: "extreme-top" },
        vtuber: { x: 0, y: -15, w: 350, h: 225, layer: "extreme-top" },
        chat: { x: 0, y: 0, layer: "top" },
        goalBars: { x: 0, y: 0, layer: "bottom" },
        socials: { x: 0, y: 0, layer: "bottom" },
      },
      chatting: {
        cam: { x: 0, y: 0, layer: "top" },
        chat: { x: 0, y: 0, layer: "top" },
      },
    },
  },
};

export const THEME_LIST = Object.values(THEMES);
