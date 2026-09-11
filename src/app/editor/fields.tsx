import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";

// ============================================================================
// Reusable Configuration-Panel primitives, in the AXIOM design language.
// CollapsibleSection · FieldRow · TextField · TextArea · ToggleRow · Segmented
// · SwatchRow. These are the building blocks the right-hand panel is assembled
// from, so every scene's config looks and behaves consistently.
// ============================================================================

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "var(--nc-text-3)", textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

export function CollapsibleSection({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid var(--nc-line)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5"
        style={{ padding: "16px 20px", background: "transparent", cursor: "pointer" }}
      >
        <div className="flex flex-1 flex-col items-start gap-0.5">
          <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: "0.08em", color: "var(--nc-text)", textTransform: "uppercase" }}>
            {title}
          </span>
          {subtitle && <span style={{ fontSize: 11, color: "var(--nc-text-3)" }}>{subtitle}</span>}
        </div>
        <motion.span animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.2 }} className="flex">
          <ChevronDown size={15} color="var(--nc-text-3)" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="flex flex-col gap-4" style={{ padding: "4px 20px 20px" }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid var(--nc-line-strong)",
  borderRadius: 10,
  color: "var(--nc-text)",
  fontSize: 13,
  padding: "9px 11px",
  outline: "none",
  fontFamily: "var(--nc-font)",
};

export function TextField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <SectionHeading>{label}</SectionHeading>
      <input style={inputBase} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function TextArea({
  label,
  value,
  placeholder,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-2">
      <SectionHeading>{label}</SectionHeading>
      <textarea
        style={{ ...inputBase, resize: "vertical", lineHeight: 1.5 }}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between"
      style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid var(--nc-line-strong)", cursor: "pointer" }}
    >
      <div className="flex flex-col items-start gap-0.5">
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--nc-text)" }}>{label}</span>
        {hint && <span style={{ fontSize: 11, color: "var(--nc-text-3)" }}>{hint}</span>}
      </div>
      <span
        style={{
          width: 38,
          height: 21,
          borderRadius: 999,
          background: checked ? "var(--nc-primary)" : "rgba(255,255,255,0.1)",
          border: "1px solid var(--nc-line-strong)",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <motion.span
          className="absolute top-1/2 rounded-full"
          style={{ width: 15, height: 15, background: "var(--nc-highlight)", y: "-50%" }}
          animate={{ left: checked ? 20 : 3 }}
          transition={{ type: "spring", stiffness: 500, damping: 34 }}
        />
      </span>
    </button>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { key: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <SectionHeading>{label}</SectionHeading>
      <div className="flex gap-1.5" style={{ padding: 3, borderRadius: 11, background: "rgba(255,255,255,0.03)", border: "1px solid var(--nc-line-strong)" }}>
        {options.map((o) => {
          const active = o.key === value;
          return (
            <button
              key={o.key}
              onClick={() => onChange(o.key)}
              className="flex-1"
              style={{
                padding: "7px 0",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                color: active ? "var(--nc-highlight)" : "var(--nc-text-3)",
                background: active ? "color-mix(in srgb, var(--nc-primary) 20%, transparent)" : "transparent",
                border: `1px solid ${active ? "var(--nc-line-brand)" : "transparent"}`,
                cursor: "pointer",
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SwatchRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { key: string; label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <SectionHeading>{label}</SectionHeading>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => {
          const active = o.value.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={o.key}
              title={o.label}
              onClick={() => onChange(o.value)}
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: o.value,
                border: `2px solid ${active ? "var(--nc-highlight)" : "transparent"}`,
                boxShadow: active ? `0 0 0 2px ${o.value}` : "none",
                cursor: "pointer",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
