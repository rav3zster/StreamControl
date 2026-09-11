import { useState, type ImgHTMLAttributes } from "react";

// Image with a graceful fallback surface if the source fails to load.
export function SafeImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  const { src, alt, style, className, ...rest } = props;

  if (failed || !src) {
    return (
      <div
        className={className}
        style={{ background: "var(--nc-panel-2)", ...style }}
        aria-label={typeof alt === "string" ? alt : undefined}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
