import type { CSSProperties } from "react";
import type { SceneConfig } from "../../store/broadcastStore";

// ============================================================================
// Helpers that translate a scene's SceneConfig into render inputs, WITHOUT
// changing any AXIOM visuals. Appearance overrides are applied as CSS custom
// properties on the scene root, so every child that already reads
// var(--nc-primary) / var(--nc-r-md) etc. re-skins live with zero refactoring.
// ============================================================================

const RADII: Record<SceneConfig["appearance"]["radius"], { sm: number; md: number; lg: number; xl: number }> = {
  sharp: { sm: 6, md: 8, lg: 12, xl: 16 },
  default: { sm: 12, md: 16, lg: 24, xl: 32 },
  round: { sm: 16, md: 22, lg: 30, xl: 40 },
};

export function appearanceVars(cfg: SceneConfig): CSSProperties {
  const { accent, radius } = cfg.appearance;
  const r = RADII[radius];
  return {
    // accent cascade — feeds var(--nc-primary) and Tailwind's --color-nc-primary
    ["--nc-primary" as string]: accent,
    ["--nc-line-brand" as string]: `color-mix(in srgb, ${accent} 40%, transparent)`,
    ["--nc-r-sm" as string]: `${r.sm}px`,
    ["--nc-r-md" as string]: `${r.md}px`,
    ["--nc-r-lg" as string]: `${r.lg}px`,
    ["--nc-r-xl" as string]: `${r.xl}px`,
  } as CSSProperties;
}

// Resolve a content value with a fallback default (empty = use default copy).
export function pick(cfg: SceneConfig, key: string, fallback: string): string {
  const v = cfg.content[key];
  return v && v.trim().length > 0 ? v : fallback;
}

export const on = (cfg: SceneConfig, key: string): boolean => cfg.widgets[key] !== false;
