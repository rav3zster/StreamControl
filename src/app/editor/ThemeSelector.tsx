import { Check, Sparkles, LayoutTemplate, Palette } from "lucide-react";
import { store, type SceneId } from "../store/broadcastStore";
import { useActiveTheme, THEME_LIST, type ThemeId } from "../store/useBroadcast";

export function ThemeSelector({ scene }: { scene: SceneId }) {
  const activeTheme = useActiveTheme();

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between text-xs text-[var(--nc-text-3)]">
        <span>Select stream aesthetic & mood:</span>
        <span className="font-mono text-[11px] font-bold text-[var(--nc-primary)]">
          {THEME_LIST.length} Themes
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {THEME_LIST.map((t) => {
          const isActive = t.id === activeTheme;
          return (
            <div
              key={t.id}
              className={`group relative flex flex-col rounded-xl p-3.5 transition-all border text-left cursor-pointer ${
                isActive
                  ? "border-[var(--nc-primary)] bg-[var(--nc-panel-2)] shadow-md"
                  : "border-[var(--nc-line-strong)] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
              onClick={() => store.setTheme(t.id, false)}
            >
              {/* Header: Name + Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border border-black/40"
                    style={{ background: t.swatches[0] }}
                  />
                  <span className="text-sm font-bold text-[var(--nc-highlight)]">
                    {t.name}
                  </span>
                </div>
                {isActive ? (
                  <span
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                    style={{
                      background: "rgba(79, 140, 255, 0.18)",
                      border: "1px solid var(--nc-primary)",
                      color: "var(--nc-primary)",
                    }}
                  >
                    <Check size={10} /> Active
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-[var(--nc-text-3)] group-hover:text-[var(--nc-text-2)]">
                    Click to activate
                  </span>
                )}
              </div>

              {/* Tagline & Description */}
              <p className="mt-1 text-xs text-[var(--nc-text-2)] font-medium leading-relaxed">
                {t.description}
              </p>

              {/* Swatches & Genre tags */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {/* Swatch dots */}
                <div className="flex items-center gap-1 mr-1.5 p-1 rounded-md bg-black/30 border border-white/5">
                  {t.swatches.map((c, i) => (
                    <span
                      key={i}
                      className="w-3 h-3 rounded-full border border-black/50"
                      style={{ background: c }}
                      title={c}
                    />
                  ))}
                </div>

                {/* Genre badges */}
                {t.genres.slice(0, 2).map((g, i) => (
                  <span
                    key={i}
                    className="rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide bg-white/5 text-[var(--nc-text-3)] border border-white/5"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Quick Action: Apply Theme's Signature Layout */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-[var(--nc-text-3)]">
                  Signature Layout Preset
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    store.setTheme(t.id, true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer hover:scale-105"
                  style={{
                    background: isActive ? "var(--nc-primary)" : "rgba(255, 255, 255, 0.08)",
                    color: isActive ? "#000000" : "var(--nc-text-2)",
                    border: isActive ? "none" : "1px solid var(--nc-line-strong)",
                  }}
                  title="Apply this theme and reset widgets to its tailored layout composition"
                >
                  <LayoutTemplate size={12} />
                  <span>Apply Theme & Layout</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
