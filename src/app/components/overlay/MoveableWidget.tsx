import React, { useState, useRef, useEffect, useCallback } from "react";
import { Move, RotateCcw, Scaling, Layers, ChevronsUp, ChevronUp, ChevronDown, ChevronsDown } from "lucide-react";
import { store, layerToZIndex, type SceneId, type WidgetTransform, type WidgetLayer } from "../../store/broadcastStore";
import { useLayoutEditMode, useWidgetPosition, useWidgetPositions, useSnapEnabled } from "../../store/useBroadcast";
import { useCanvasScale } from "./CanvasStage";

const LAYER_OPTIONS: { key: WidgetLayer; label: string; desc: string; icon: React.ReactNode }[] = [
  { key: "extreme-top", label: "Extreme Top", desc: "Topmost / in front of all widgets", icon: <ChevronsUp size={12} /> },
  { key: "top", label: "Top", desc: "Above normal widgets", icon: <ChevronUp size={12} /> },
  { key: "bottom", label: "Bottom", desc: "Under normal widgets", icon: <ChevronDown size={12} /> },
  { key: "extreme-bottom", label: "Extreme Bottom", desc: "Background / behind all widgets", icon: <ChevronsDown size={12} /> },
];

interface MoveableWidgetProps {
  scene: SceneId;
  id: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
}

export function MoveableWidget({
  scene,
  id,
  label,
  className = "",
  style = {},
  children,
  minWidth = 120,
  minHeight = 60,
}: MoveableWidgetProps) {
  const editMode = useLayoutEditMode();
  const snapEnabled = useSnapEnabled();
  const savedTransform = useWidgetPosition(scene, id) as WidgetTransform;
  const allSceneWidgets = useWidgetPositions(scene);
  const scale = useCanvasScale() || 1;

  const widgetRef = useRef<HTMLDivElement>(null);

  // Layer menu state
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Local drag/resize state for fluid 60fps rendering
  const [dragTransform, setDragTransform] = useState<WidgetTransform | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Snap guidelines indicator: { x?: number, y?: number }
  const [snapGuideX, setSnapGuideX] = useState<boolean>(false);
  const [snapGuideY, setSnapGuideY] = useState<boolean>(false);

  // Sync saved transform when not dragging/resizing
  useEffect(() => {
    if (!isDragging && !isResizing) {
      setDragTransform(null);
      setSnapGuideX(false);
      setSnapGuideY(false);
    }
  }, [savedTransform, isDragging, isResizing]);

  const currentTransform: WidgetTransform = dragTransform ?? savedTransform;
  const isMoved = currentTransform.x !== 0 || currentTransform.y !== 0;
  const isResized = currentTransform.w !== undefined || currentTransform.h !== undefined;

  // --- DRAG TO MOVE WITH SNAPPING ---
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode || e.button !== 0) return;

      const target = e.target as HTMLElement;
      // Do not initiate move if clicking resize handles or buttons
      if (target.closest(".resize-handle") || target.closest("button.no-drag")) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const origX = currentTransform.x;
      const origY = currentTransform.y;
      const currentW = currentTransform.w;
      const currentH = currentTransform.h;

      // Extract coordinates of other widgets in the same scene for alignment snapping
      const otherCoords: { x: number; y: number }[] = [];
      Object.entries(allSceneWidgets).forEach(([key, tr]) => {
        if (key !== id && tr) {
          otherCoords.push({ x: tr.x, y: tr.y });
        }
      });

      setIsDragging(true);
      let lastX = origX;
      let lastY = origY;

      const onPointerMove = (moveEvent: PointerEvent) => {
        const dx = (moveEvent.clientX - startX) / scale;
        const dy = (moveEvent.clientY - startY) / scale;
        let nextX = Math.round(origX + dx);
        let nextY = Math.round(origY + dy);

        let activeSnapX = false;
        let activeSnapY = false;

        if (snapEnabled) {
          const SNAP_THRESHOLD = 12;

          // 1. Center / origin snap (align to relative 0)
          if (Math.abs(nextX) <= SNAP_THRESHOLD) {
            nextX = 0;
            activeSnapX = true;
          }
          if (Math.abs(nextY) <= SNAP_THRESHOLD) {
            nextY = 0;
            activeSnapY = true;
          }

          // 2. Parallel placement snap against other widgets
          for (const other of otherCoords) {
            if (!activeSnapX && Math.abs(nextX - other.x) <= SNAP_THRESHOLD) {
              nextX = other.x;
              activeSnapX = true;
            }
            if (!activeSnapY && Math.abs(nextY - other.y) <= SNAP_THRESHOLD) {
              nextY = other.y;
              activeSnapY = true;
            }
          }

          // 3. Grid snap (8px grid) if not snapped to center/widget
          if (!activeSnapX) {
            nextX = Math.round(nextX / 8) * 8;
          }
          if (!activeSnapY) {
            nextY = Math.round(nextY / 8) * 8;
          }
        }

        setSnapGuideX(activeSnapX);
        setSnapGuideY(activeSnapY);

        lastX = nextX;
        lastY = nextY;
        setDragTransform({
          x: nextX,
          y: nextY,
          w: currentW,
          h: currentH,
        });
      };

      const onPointerUp = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        setIsDragging(false);
        setSnapGuideX(false);
        setSnapGuideY(false);
        setDragTransform(null);
        store.setWidgetPosition(scene, id, { x: lastX, y: lastY });
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    [editMode, currentTransform, scale, scene, id, snapEnabled, allSceneWidgets]
  );

  // --- DRAG TO RESIZE ---
  const handleResizeStart = useCallback(
    (e: React.PointerEvent, handleType: "both" | "width" | "height") => {
      if (!editMode || e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();

      const el = widgetRef.current;
      const initialRect = el ? el.getBoundingClientRect() : null;
      const initialWidth = currentTransform.w ?? (initialRect ? Math.round(initialRect.width / scale) : 320);
      const initialHeight = currentTransform.h ?? (initialRect ? Math.round(initialRect.height / scale) : 200);

      const startX = e.clientX;
      const startY = e.clientY;

      setIsResizing(true);
      let lastW = initialWidth;
      let lastH = initialHeight;

      const onPointerMove = (moveEvent: PointerEvent) => {
        const dx = (moveEvent.clientX - startX) / scale;
        const dy = (moveEvent.clientY - startY) / scale;

        let nextW = initialWidth;
        let nextH = initialHeight;

        if (handleType === "both" || handleType === "width") {
          nextW = Math.max(minWidth, Math.round(initialWidth + dx));
          if (snapEnabled) {
            nextW = Math.round(nextW / 8) * 8;
          }
        }

        if (handleType === "both" || handleType === "height") {
          nextH = Math.max(minHeight, Math.round(initialHeight + dy));
          if (snapEnabled) {
            nextH = Math.round(nextH / 8) * 8;
          }
        }

        lastW = nextW;
        lastH = nextH;

        setDragTransform((prev) => ({
          x: prev?.x ?? currentTransform.x,
          y: prev?.y ?? currentTransform.y,
          w: nextW,
          h: nextH,
        }));
      };

      const onPointerUp = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        setIsResizing(false);
        setDragTransform(null);
        store.setWidgetSize(scene, id, { w: lastW, h: lastH });
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    [editMode, currentTransform, scale, scene, id, minWidth, minHeight, snapEnabled]
  );

  const handleResetPosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    store.setWidgetPosition(scene, id, { x: 0, y: 0 });
  };

  const handleResetSize = (e: React.MouseEvent) => {
    e.stopPropagation();
    store.resetWidgetSize(scene, id);
  };

  const transformStyle =
    currentTransform.x !== 0 || currentTransform.y !== 0
      ? `translate3d(${currentTransform.x}px, ${currentTransform.y}px, 0)`
      : undefined;

  const widgetName = label || id.replace(/([A-Z])/g, " $1").trim();

  const configuredZIndex = layerToZIndex(currentTransform.layer);
  const activeZIndex = isDragging || isResizing ? 80 : editMode ? configuredZIndex + 10 : configuredZIndex;

  const handleWidgetClick = (e: React.MouseEvent) => {
    if (!editMode) return;
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest(".resize-handle")) return;
    setShowLayerMenu((prev) => !prev);
  };

  return (
    <div
      ref={widgetRef}
      onPointerDown={editMode ? handlePointerDown : undefined}
      onClick={editMode ? handleWidgetClick : undefined}
      className={`relative transition-shadow duration-150 ${className} ${
        editMode
          ? isDragging
            ? "cursor-grabbing select-none"
            : isResizing
            ? "select-none"
            : "cursor-grab"
          : ""
      }`}
      style={{
        ...style,
        width: currentTransform.w ? `${currentTransform.w}px` : style.width,
        height: currentTransform.h ? `${currentTransform.h}px` : style.height,
        transform: transformStyle,
        zIndex: activeZIndex,
        outline: editMode
          ? isDragging || isResizing
            ? "2px solid var(--nc-primary)"
            : "1.5px dashed rgba(79, 140, 255, 0.55)"
          : undefined,
        outlineOffset: editMode ? "2px" : undefined,
        borderRadius: editMode ? "10px" : undefined,
        boxShadow:
          editMode && (isDragging || isResizing)
            ? "0 10px 30px rgba(0,0,0,0.55), 0 0 24px rgba(79, 140, 255, 0.4)"
            : editMode
            ? "0 0 10px rgba(79, 140, 255, 0.12)"
            : style.boxShadow,
      }}
    >
      {/* SNAP GUIDELINES (Visual Glowing Alignment Lines) */}
      {editMode && snapGuideX && (
        <div
          className="pointer-events-none absolute -top-[1000px] -bottom-[1000px] left-1/2 -translate-x-1/2 z-50 w-[1.5px]"
          style={{
            background: "var(--nc-accent)",
            boxShadow: "0 0 8px var(--nc-accent)",
          }}
        />
      )}
      {editMode && snapGuideY && (
        <div
          className="pointer-events-none absolute -left-[2000px] -right-[2000px] top-1/2 -translate-y-1/2 z-50 h-[1.5px]"
          style={{
            background: "var(--nc-accent)",
            boxShadow: "0 0 8px var(--nc-accent)",
          }}
        />
      )}

      {/* EDIT MODE TOP INFO & CONTROLS BADGE */}
      {editMode && (
        <div
          className="absolute -top-7 left-0 z-50 flex items-center gap-1.5 pointer-events-auto select-none"
          style={{
            background: isDragging || isResizing ? "var(--nc-primary)" : "rgba(8, 11, 20, 0.95)",
            color: isDragging || isResizing ? "#000" : "var(--nc-text)",
            border: isDragging || isResizing
              ? "1px solid var(--nc-primary)"
              : "1px solid var(--nc-line-brand)",
            borderRadius: 6,
            padding: "2px 7px",
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.04em",
            backdropFilter: "blur(10px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
          }}
        >
          <Move size={11} className="shrink-0 opacity-80" />
          <span className="capitalize">{widgetName}</span>

          {/* Position readout */}
          {isMoved && (
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 9.5,
                opacity: isDragging ? 0.9 : 0.65,
                marginLeft: 2,
              }}
            >
              ({currentTransform.x > 0 ? `+${currentTransform.x}` : currentTransform.x},{" "}
              {currentTransform.y > 0 ? `+${currentTransform.y}` : currentTransform.y})
            </span>
          )}

          {/* Size readout */}
          {isResized && (
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 9.5,
                opacity: isDragging ? 0.9 : 0.7,
                marginLeft: 3,
                color: isDragging || isResizing ? "#000" : "var(--nc-accent)",
              }}
            >
              [{currentTransform.w ?? "auto"}×{currentTransform.h ?? "auto"}]
            </span>
          )}

          {/* Layer Selector Button & Dropdown */}
          <div className="relative no-drag ml-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowLayerMenu((prev) => !prev);
              }}
              title="Set widget layer: Extreme Top, Top, Bottom, Extreme Bottom"
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-semibold transition-all cursor-pointer"
              style={{
                background: currentTransform.layer
                  ? "rgba(0, 229, 255, 0.2)"
                  : "rgba(255, 255, 255, 0.08)",
                color: isDragging || isResizing
                  ? "#000"
                  : currentTransform.layer
                  ? "var(--nc-accent)"
                  : "var(--nc-text-2)",
                border: "1px solid var(--nc-line-strong)",
              }}
            >
              <Layers size={10} />
              <span className="capitalize">
                {currentTransform.layer ? currentTransform.layer.replace("-", " ") : "Layer"}
              </span>
            </button>

            {showLayerMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-6 left-0 z-[100] flex flex-col p-1.5 rounded-xl border shadow-2xl backdrop-blur-xl"
                style={{
                  width: 195,
                  background: "rgba(10, 13, 24, 0.98)",
                  borderColor: "var(--nc-line-brand)",
                  boxShadow: "0 14px 40px rgba(0,0,0,0.8), 0 0 20px rgba(79, 140, 255, 0.25)",
                }}
              >
                <div className="flex items-center justify-between px-2 py-1 border-b border-white/10 mb-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--nc-text-3)]">
                    Layer Order
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLayerMenu(false)}
                    className="text-[10px] text-white/50 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {LAYER_OPTIONS.map((opt) => {
                  const isSelected = (currentTransform.layer ?? "default") === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        store.setWidgetLayer(scene, id, opt.key);
                        setShowLayerMenu(false);
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all hover:bg-white/10 cursor-pointer"
                      style={{
                        background: isSelected ? "rgba(79, 140, 255, 0.22)" : "transparent",
                        border: isSelected ? "1px solid var(--nc-primary)" : "1px solid transparent",
                        color: isSelected ? "var(--nc-highlight)" : "var(--nc-text)",
                      }}
                    >
                      <span style={{ color: isSelected ? "var(--nc-primary)" : "var(--nc-text-3)" }}>
                        {opt.icon}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">{opt.label}</span>
                        <span className="text-[9px] text-[var(--nc-text-3)]">{opt.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reset position button */}
          {isMoved && (
            <button
              type="button"
              onClick={handleResetPosition}
              title="Reset position"
              className="no-drag ml-0.5 flex items-center justify-center p-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer"
              style={{
                color: isDragging || isResizing ? "#000" : "var(--nc-accent)",
              }}
            >
              <RotateCcw size={10} />
            </button>
          )}

          {/* Reset size button */}
          {isResized && (
            <button
              type="button"
              onClick={handleResetSize}
              title="Reset size to default"
              className="no-drag ml-0.5 flex items-center justify-center p-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer"
              style={{
                color: isDragging || isResizing ? "#000" : "var(--nc-primary)",
              }}
            >
              <Scaling size={10} />
            </button>
          )}
        </div>
      )}

      {/* EDIT MODE RESIZE HANDLES */}
      {editMode && (
        <>
          {/* Bottom-Right Corner Resize Grip */}
          <div
            onPointerDown={(e) => handleResizeStart(e, "both")}
            title="Drag to resize width and height"
            className="resize-handle absolute -bottom-1.5 -right-1.5 z-50 flex items-center justify-center cursor-se-resize select-none transition-transform hover:scale-125"
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: "var(--nc-primary)",
              border: "1.5px solid #000",
              boxShadow: "0 0 6px rgba(79,140,255,0.7)",
            }}
          >
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: 1,
                background: "#000",
              }}
            />
          </div>

          {/* Right Edge Resize Bar */}
          <div
            onPointerDown={(e) => handleResizeStart(e, "width")}
            title="Drag to resize width"
            className="resize-handle absolute top-2 bottom-2 -right-1 z-40 w-2 cursor-e-resize hover:bg-[var(--nc-primary)]/40 rounded-full transition-colors"
          />

          {/* Bottom Edge Resize Bar */}
          <div
            onPointerDown={(e) => handleResizeStart(e, "height")}
            title="Drag to resize height"
            className="resize-handle absolute left-2 right-2 -bottom-1 z-40 h-2 cursor-s-resize hover:bg-[var(--nc-primary)]/40 rounded-full transition-colors"
          />
        </>
      )}

      {children}
    </div>
  );
}
