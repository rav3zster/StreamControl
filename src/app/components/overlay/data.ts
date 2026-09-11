// ============================================================================
// Neo Cyber overlay pack — shared broadcast data & brand configuration.
// All copy lives here so a single edit re-skins the whole pack.
// ============================================================================

export const BRAND = {
  handle: "AXIOM",
  tagline: "Competitive · Neo Cyber Broadcast",
  streamTitle: "VALORANT · Ranked Grind to Radiant",
  category: "VALORANT",
};

export type Social = { platform: string; handle: string };

export const SOCIALS: Social[] = [
  { platform: "Twitch", handle: "twitch.tv/axiom" },
  { platform: "YouTube", handle: "@axiom" },
  { platform: "X", handle: "@axiomplays" },
  { platform: "Discord", handle: "discord.gg/axiom" },
];

export type EventKind = "follow" | "sub" | "donation" | "raid" | "cheer";

export type StreamEvent = {
  id: string;
  kind: EventKind;
  user: string;
  detail: string;
  time: string;
};

export const RECENT_EVENTS: StreamEvent[] = [
  { id: "e1", kind: "donation", user: "Nightfall", detail: "$25.00", time: "now" },
  { id: "e2", kind: "sub", user: "Kestrel", detail: "3 months · Tier 2", time: "1m" },
  { id: "e3", kind: "follow", user: "Vela_", detail: "followed", time: "2m" },
  { id: "e4", kind: "raid", user: "PhaseTwo", detail: "raid · 142", time: "4m" },
  { id: "e5", kind: "cheer", user: "Orbit", detail: "500 bits", time: "6m" },
  { id: "e6", kind: "follow", user: "Mika.exe", detail: "followed", time: "7m" },
];

export type ChatMsg = { id: string; user: string; color: string; text: string; badge?: string };

export const CHAT: ChatMsg[] = [
  { id: "c1", user: "Kestrel", color: "var(--nc-primary)", text: "that clutch was insane", badge: "SUB" },
  { id: "c2", user: "Vela_", color: "var(--nc-secondary)", text: "GG easy" },
  { id: "c3", user: "Orbit", color: "var(--nc-accent)", text: "aim is unreal today", badge: "VIP" },
  { id: "c4", user: "Nightfall", color: "var(--nc-primary)", text: "up 2 more wins to rank up 🔥" },
  { id: "c5", user: "PhaseTwo", color: "var(--nc-secondary)", text: "what sens are you on?" },
  { id: "c6", user: "Mika.exe", color: "var(--nc-text-2)", text: "the overlay is clean asf" },
  { id: "c7", user: "Solace", color: "var(--nc-accent)", text: "lets gooo" },
  { id: "c8", user: "Rift", color: "var(--nc-primary)", text: "first time here, loving the vibe", badge: "NEW" },
];

export const GOALS = {
  follower: { label: "Follower Goal", current: 8420, target: 10000 },
  subscriber: { label: "Subscriber Goal", current: 312, target: 500 },
};

export const LATEST = {
  follower: "Vela_",
  subscriber: "Kestrel",
  donation: { user: "Nightfall", amount: "$25.00" },
  topDonator: { user: "Solace", amount: "$412.00" },
};

export const MATCH = {
  game: "VALORANT",
  rank: "Immortal 2",
  objective: "Road to Radiant",
  winStreak: "5 Wins",
};

export const SESSION_STATS = [
  { label: "Followers", value: "+184" },
  { label: "Subs", value: "+37" },
  { label: "Hours", value: "6.4" },
  { label: "Raids", value: "3" },
  { label: "Peak Viewers", value: "1,204" },
];

export type ScheduleItem = { day: string; title: string; time: string };

export const SCHEDULE: ScheduleItem[] = [
  { day: "MON", title: "Ranked Ladder", time: "18:00" },
  { day: "WED", title: "Community Games", time: "18:00" },
  { day: "FRI", title: "Tournament Night", time: "20:00" },
  { day: "SAT", title: "Just Chatting + Review", time: "16:00" },
];
