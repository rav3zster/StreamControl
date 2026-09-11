import { useTimer, useSceneConfig } from "../store/useBroadcast";
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
// The scene's Appearance (accent + corner radius) is applied here as CSS custom
// properties on the wrapper, so every child that reads var(--nc-primary) /
// var(--nc-r-*) re-skins live — without touching any scene visuals.
// ============================================================================

export function SceneView({ scene }: { scene: SceneId }) {
  const startingTimer = useTimer("starting");
  const brbTimer = useTimer("brb");
  const config = useSceneConfig(scene);

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

  return (
    <div className="h-full w-full" style={appearanceVars(config)}>
      {body()}
    </div>
  );
}
