import { useTimer, useSceneConfig, useActiveTheme, THEMES } from "../store/useBroadcast";
import type { SceneId } from "../store/broadcastStore";
import { appearanceVars } from "../components/overlay/sceneConfig";
import { StartingSoon } from "../components/overlay/scenes/StartingSoon";
import { LiveGameplay } from "../components/overlay/scenes/LiveGameplay";
import { JustChatting } from "../components/overlay/scenes/JustChatting";
import { BRB } from "../components/overlay/scenes/BRB";
import { StreamEnding } from "../components/overlay/scenes/StreamEnding";

// ============================================================================
// SceneView — renders a single scene from its shared config, wiring in shared
// timer readouts. Used identically by the editor preview and the OBS output
// pages so what you configure is exactly what streams.
//
// The active theme (Cyber Esports, Neobrutalism, Minimal Zen, Synthwave Sunset)
// is applied via `data-theme` attribute and CSS variable cascade to guarantee
// complete live restyling in browser and OBS feeds without page reload.
// ============================================================================

export function SceneView({ scene }: { scene: SceneId }) {
  const startingTimer = useTimer("starting");
  const brbTimer = useTimer("brb");
  const config = useSceneConfig(scene);
  const activeTheme = useActiveTheme();
  const themeDef = THEMES[activeTheme];

  const body = () => {
    switch (scene) {
      case "starting":
        return <StartingSoon m={startingTimer.m} s={startingTimer.s} config={config} />;
      case "live":
        return <LiveGameplay config={config} />;
      case "chatting":
        return <JustChatting config={config} />;
      case "brb":
        return <BRB m={brbTimer.m} s={brbTimer.s} running={brbTimer.running} config={config} />;
      case "ending":
        return <StreamEnding config={config} />;
      default:
        return null;
    }
  };

  const combinedStyles = {
    ...(themeDef?.cssVars ?? {}),
    ...appearanceVars(config),
  };

  return (
    <div className="h-full w-full" data-theme={activeTheme} style={combinedStyles}>
      {body()}
    </div>
  );
}
