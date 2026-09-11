import React, { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, RotateCcw, CheckCircle2 } from "lucide-react";
import { store } from "../store/broadcastStore";
import { useCustomLogo } from "../store/useBroadcast";

// Resize image before storing as Base64 to avoid localStorage quota issues while keeping crispness
function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's an SVG, read directly as data URL or text data URL
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_W = 800;
        const MAX_H = 400;
        let width = img.width;
        let height = img.height;

        if (width > MAX_W || height > MAX_H) {
          const ratio = Math.min(MAX_W / width, MAX_H / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw image keeping transparency
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Export as PNG data URL
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function LogoUploader() {
  const { customLogo } = useCustomLogo();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, SVG, JPG, WebP).");
      return;
    }

    try {
      setIsProcessing(true);
      const dataUrl = await processImageFile(file);
      store.setCustomLogo(dataUrl);
    } catch (err) {
      console.error("Failed to process logo:", err);
      alert("Could not load image. Please try another file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Preview Card with Checkerboard Background for Transparency */}
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border p-4 transition-all"
        style={{
          background:
            "linear-gradient(45deg, #0e111a 25%, transparent 25%), linear-gradient(-45deg, #0e111a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #0e111a 75%), linear-gradient(-45deg, transparent 75%, #0e111a 75%), #07090e",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
          borderColor: customLogo ? "var(--nc-primary)" : "var(--nc-line-strong)",
          minHeight: 110,
        }}
      >
        <img
          src={customLogo || "/assets/logos/r3-logo-full.png"}
          alt="Active Logo"
          style={{
            maxHeight: 64,
            maxWidth: "85%",
            objectFit: "contain",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))",
          }}
        />

        <div className="absolute top-2 right-2">
          {customLogo ? (
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
              style={{
                background: "rgba(79, 140, 255, 0.2)",
                border: "1px solid var(--nc-line-brand)",
                color: "var(--nc-primary)",
              }}
            >
              <CheckCircle2 size={11} /> Custom Logo
            </span>
          ) : (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                color: "var(--nc-text-3)",
                border: "1px solid var(--nc-line)",
              }}
            >
              Default Pack Logo
            </span>
          )}
        </div>
      </div>

      {/* Upload Drop Zone / Button */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-4 text-center transition-all hover:border-[var(--nc-primary)] hover:bg-[rgba(79,140,255,0.04)]"
        style={{
          borderColor: isDragging ? "var(--nc-primary)" : "var(--nc-line-strong)",
          background: isDragging ? "rgba(79, 140, 255, 0.08)" : "rgba(255, 255, 255, 0.015)",
        }}
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            background: "rgba(79, 140, 255, 0.12)",
            color: "var(--nc-primary)",
          }}
        >
          {isProcessing ? (
            <ImageIcon size={18} className="animate-spin" />
          ) : (
            <UploadCloud size={18} />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[var(--nc-highlight)]">
            {customLogo ? "Click or drop to replace logo" : "Upload logo from your device"}
          </span>
          <span className="text-[11px] text-[var(--nc-text-3)] mt-0.5">
            PNG (transparent), SVG, JPG, WebP
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {customLogo && (
        <button
          type="button"
          onClick={() => store.resetCustomLogo()}
          className="flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-colors hover:bg-white/5"
          style={{
            border: "1px solid var(--nc-line-strong)",
            color: "var(--nc-text-2)",
          }}
        >
          <RotateCcw size={12} />
          Reset to Default Logo
        </button>
      )}
    </div>
  );
}
