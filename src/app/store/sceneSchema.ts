import type { SceneId } from "./broadcastStore";

// ============================================================================
// sceneSchema — the data-driven description of every scene. The editor's right
// Configuration Panel is generated entirely from this, and the store seeds its
// per-scene defaults from it. Scenes read the resulting config to decide which
// blocks to render, so toggling a widget reflows the layout automatically.
//
// This does NOT change any AXIOM visuals — it only declares what is
// configurable. Adding a field here surfaces a control; scenes gate on it.
// ============================================================================

export type WidgetDef = { key: string; label: string };
export type ContentDef = { key: string; label: string; placeholder?: string; multiline?: boolean };

export type SceneSchema = {
  widgets: WidgetDef[];
  content: ContentDef[];
  hasCountdown: boolean;
  hasSocial: boolean;
  autoSwitchLabel?: string;
};

// Social platforms available across the pack. Keys are stable ids.
export const SOCIAL_PLATFORMS: { key: string; label: string; handle: string }[] = [
  { key: "twitch", label: "Twitch", handle: "twitch.tv/axiom" },
  { key: "youtube", label: "YouTube", handle: "@axiom" },
  { key: "x", label: "X", handle: "@axiomplays" },
  { key: "discord", label: "Discord", handle: "discord.gg/axiom" },
  { key: "kick", label: "Kick", handle: "kick.com/axiom" },
  { key: "instagram", label: "Instagram", handle: "@axiom.gg" },
  { key: "tiktok", label: "TikTok", handle: "@axiom" },
];

// Accent presets (Appearance → Accent Color). Value overrides --nc-primary.
export const ACCENT_PRESETS: { key: string; label: string; value: string }[] = [
  { key: "blue", label: "Cyber Blue", value: "#4f8cff" },
  { key: "violet", label: "Violet", value: "#7b61ff" },
  { key: "aqua", label: "Aqua", value: "#00e5ff" },
  { key: "magenta", label: "Magenta", value: "#ff4fd8" },
  { key: "lime", label: "Lime", value: "#8cff4f" },
  { key: "amber", label: "Amber", value: "#ffb64f" },
];

export const RADIUS_PRESETS: { key: RadiusKey; label: string }[] = [
  { key: "sharp", label: "Sharp" },
  { key: "default", label: "Default" },
  { key: "round", label: "Round" },
];

export type RadiusKey = "sharp" | "default" | "round";

export const SCENE_SCHEMA: Record<SceneId, SceneSchema> = {
  starting: {
    hasCountdown: true,
    hasSocial: true,
    autoSwitchLabel: "Auto-switch to Gameplay",
    widgets: [
      { key: "countdown", label: "Countdown" },
      { key: "streamTitle", label: "Stream Title" },
      { key: "musicWidget", label: "Music Widget" },
      { key: "latestFollow", label: "Latest Follow" },
      { key: "latestSub", label: "Latest Subscriber" },
      { key: "socialLinks", label: "Social Links" },
    ],
    content: [
      { key: "title", label: "Stream Title", placeholder: "VALORANT · Ranked Grind to Radiant" },
      { key: "tagline", label: "Tagline", placeholder: "Competitive · Neo Cyber Broadcast" },
      { key: "category", label: "Category", placeholder: "VALORANT" },
    ],
  },
  live: {
    hasCountdown: false,
    hasSocial: false,
    widgets: [
      { key: "gameplayRegion", label: "Gameplay Region" },
      { key: "vtuber", label: "VTuber Region" },
      { key: "chat", label: "Chat" },
      { key: "goalBars", label: "Goal Bars" },
      { key: "recentEvents", label: "Recent Events" },
      { key: "latestStats", label: "Latest Stats" },
      { key: "musicWidget", label: "Music Widget" },
      { key: "alerts", label: "Alert Area" },
      { key: "lowerThird", label: "Lower Third" },
    ],
    content: [
      { key: "game", label: "Current Game", placeholder: "VALORANT" },
      { key: "rank", label: "Rank", placeholder: "Immortal 2" },
      { key: "objective", label: "Objective", placeholder: "Road to Radiant" },
    ],
  },
  chatting: {
    hasCountdown: false,
    hasSocial: false,
    widgets: [
      { key: "vtuber", label: "VTuber Region" },
      { key: "chat", label: "Chat" },
      { key: "musicWidget", label: "Music Widget" },
      { key: "goalBars", label: "Goal Bars" },
      { key: "topic", label: "Topic Panel" },
      { key: "sponsor", label: "Sponsor Panel" },
      { key: "recentEvents", label: "Recent Events Count" },
    ],
    content: [
      { key: "topic", label: "Topic", placeholder: "Q&A · Setup Tour · Community Games" },
    ],
  },
  brb: {
    hasCountdown: true,
    hasSocial: true,
    autoSwitchLabel: "Auto-switch to Gameplay",
    widgets: [
      { key: "countdown", label: "Countdown" },
      { key: "musicWidget", label: "Music Widget" },
      { key: "latestFollow", label: "Latest Follow" },
      { key: "chatNote", label: "Chat Note" },
      { key: "socialLinks", label: "Social Links" },
    ],
    content: [
      { key: "message", label: "Return Note", placeholder: "Chat is still open — say hi 👋" },
      { key: "thanks", label: "Thank-You Message", placeholder: "Thanks for waiting ❤️" },
    ],
  },
  ending: {
    hasCountdown: false,
    hasSocial: true,
    widgets: [
      { key: "sessionStats", label: "Session Stats" },
      { key: "schedule", label: "Schedule" },
      { key: "qrCodes", label: "QR Codes" },
      { key: "socialLinks", label: "Social Links" },
    ],
    content: [
      { key: "heading", label: "Thank-You Heading", placeholder: "See you\nnext time." },
      { key: "tagline", label: "Tagline", placeholder: "Competitive · Neo Cyber Broadcast" },
    ],
  },
};
