"use client";

import { useRef, useState, useCallback } from "react";

interface GlowCardProps {
  children: React.ReactNode;
  /**
   * Glow color. Should CONTRAST the card background.
   * Pink card → use purple "#a855f7"
   * Dark card → use pink "#ff69b4"
   */
  glowColor?: string;
  className?: string;
  style?: React.CSSProperties;
  glowOpacity?: number;
  borderRadius?: string;
}

export default function GlowCard({
  children,
  glowColor = "#a855f7",
  className = "",
  style = {},
  glowOpacity = 0.35,
  borderRadius = "0.75rem",
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const hex2rgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r
      ? `${parseInt(r[1], 16)}, ${parseInt(r[2], 16)}, ${parseInt(r[3], 16)}`
      : "168, 85, 247";
  };
  const rgb = hex2rgb(glowColor);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        position: "relative",
        borderRadius,
        overflow: "hidden",
        // Strong glowing border — visible even at rest on dark bg
        border: `1.5px solid rgba(${rgb}, ${hovered ? 0.85 : 0.45})`,
        // Outer box-shadow glow (visible OUTSIDE the card on the dark page bg)
        boxShadow: hovered
          ? `0 0 0 1px rgba(${rgb}, 0.3),
             0 0 16px 4px rgba(${rgb}, 0.55),
             0 0 45px 10px rgba(${rgb}, 0.25)`
          : `0 0 0 1px rgba(${rgb}, 0.12),
             0 0 12px 3px rgba(${rgb}, 0.28)`,
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
      }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cursor-following spotlight — contrasting colour punches through solid bg */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          background: `radial-gradient(
            350px circle at ${pos.x}px ${pos.y}px,
            rgba(${rgb}, ${glowOpacity}),
            transparent 60%
          )`,
        }}
      />
      {/* Content */}
      <div style={{ position: "relative", zIndex: 10 }}>{children}</div>
    </div>
  );
}