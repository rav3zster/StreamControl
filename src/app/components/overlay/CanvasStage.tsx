import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

// ============================================================================
// CanvasStage — fixed 1920×1080 broadcast canvas, scaled to fit the viewport.
// Every scene composes inside this so layouts stay pixel-exact to spec while
// remaining fully responsive in the preview.
// ============================================================================

const W = 1920;
const H = 1080;

export const CanvasScaleContext = createContext<number>(1);
export const useCanvasScale = () => useContext(CanvasScaleContext);

export const CanvasEditableContext = createContext<boolean>(false);
export const useCanvasEditable = () => useContext(CanvasEditableContext);

export function CanvasStage({
  children,
  editable = false,
}: {
  children: ReactNode;
  editable?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      setScale(Math.min(width / W, height / H));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <div
        style={{
          width: W,
          height: H,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          fontFamily: "var(--nc-font)",
        }}
        className="relative shrink-0 overflow-hidden bg-nc-bg text-nc-text antialiased"
      >
        <CanvasScaleContext.Provider value={scale}>
          <CanvasEditableContext.Provider value={editable}>
            {children}
          </CanvasEditableContext.Provider>
        </CanvasScaleContext.Provider>
      </div>
    </div>
  );
}
