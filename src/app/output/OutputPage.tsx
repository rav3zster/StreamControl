import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useParams, Link } from "react-router";
import { CanvasStage } from "../components/overlay/CanvasStage";
import { SceneView } from "./SceneView";
import { useBroadcastState, slugToScene } from "../store/useBroadcast";

// ============================================================================
// Output pages — what OBS loads as a Browser Source. ONLY the 1920×1080 canvas.
// No sidebar, no controls, no editor chrome. The page background is transparent
// so OBS can composite the feed over game capture / VTube Studio.
// ============================================================================

function useTransparentBody() {
  useEffect(() => {
    const prevBody = document.body.style.background;
    const prevHtml = document.documentElement.style.background;
    document.body.style.background = "transparent";
    document.documentElement.style.background = "transparent";
    return () => {
      document.body.style.background = prevBody;
      document.documentElement.style.background = prevHtml;
    };
  }, []);
}

function Shell({ children }: { children: React.ReactNode }) {
  useTransparentBody();
  return (
    <div className="fixed inset-0" style={{ background: "transparent" }}>
      {children}
    </div>
  );
}

// /output — Program feed: follows the scene the editor selects, live.
export function ProgramOutput() {
  const state = useBroadcastState();
  return (
    <Shell>
      <AnimatePresence mode="wait">
        <motion.div
          key={state.activeScene}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <CanvasStage editable={false}>
            <SceneView scene={state.activeScene} />
          </CanvasStage>
        </motion.div>
      </AnimatePresence>
    </Shell>
  );
}

// /output/:scene — a single fixed scene, one per OBS Browser Source.
export function SceneOutput() {
  const { scene: slug } = useParams();
  const scene = slugToScene(slug);

  if (!scene) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-3" style={{ background: "var(--nc-bg)", fontFamily: "var(--nc-font)" }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: "var(--nc-highlight)" }}>Unknown output feed</span>
        <span style={{ fontSize: 14, color: "var(--nc-text-3)" }}>“{slug}” is not a valid scene.</span>
        <Link to="/" style={{ fontSize: 13, color: "var(--nc-primary)" }}>← Back to editor</Link>
      </div>
    );
  }

  return (
    <Shell>
      <CanvasStage editable={false}>
        <SceneView scene={scene} />
      </CanvasStage>
    </Shell>
  );
}
