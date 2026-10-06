import React, { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export interface ScoreArcProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  tone?: "lime" | "forest" | "blue" | "emerald" | "auto";
  showScore?: boolean;
  scoreSuffix?: string;
  className?: string;
  label?: string;
  durationMs?: number;
}

export function ScoreArc({
  score,
  maxScore = 100,
  size = 56,
  strokeWidth = 4.5,
  tone = "auto",
  showScore = true,
  scoreSuffix = "%",
  className = "",
  label,
  durationMs = 900,
}: ScoreArcProps) {
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (!isRevealed) return;
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 80);
    return () => clearTimeout(timer);
  }, [isRevealed, score]);

  // Radius and circumference
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max(animatedScore / maxScore, 0), 1);
  const strokeDashoffset = circumference - percentage * circumference;

  // Color mapping based on score or tone
  const getStrokeColors = () => {
    if (tone === "lime") return { stroke: "#7ca93a", glow: "rgba(198, 243, 107, 0.4)", track: "rgba(23, 34, 30, 0.08)" };
    if (tone === "forest") return { stroke: "#17221e", glow: "rgba(23, 34, 30, 0.2)", track: "rgba(23, 34, 30, 0.08)" };
    if (tone === "blue") return { stroke: "#365970", glow: "rgba(54, 89, 112, 0.25)", track: "rgba(54, 89, 112, 0.1)" };
    if (tone === "emerald") return { stroke: "#496724", glow: "rgba(73, 103, 36, 0.3)", track: "rgba(73, 103, 36, 0.1)" };
    
    // Auto mode based on percentage
    if (score >= 90) {
      return { stroke: "#779643", glow: "rgba(119, 150, 67, 0.35)", track: "rgba(23, 34, 30, 0.08)" };
    } else if (score >= 80) {
      return { stroke: "#4a6e87", glow: "rgba(74, 110, 135, 0.35)", track: "rgba(23, 34, 30, 0.08)" };
    }
    return { stroke: "#536159", glow: "rgba(83, 97, 89, 0.3)", track: "rgba(23, 34, 30, 0.08)" };
  };

  const { stroke, track } = getStrokeColors();

  return (
    <div ref={ref} className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[-90deg] transform"
          aria-hidden="true"
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={track}
            strokeWidth={strokeWidth}
          />
          {/* Animated Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: `stroke-dashoffset ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          />
        </svg>

        {showScore && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="display-font font-bold tracking-tight text-[#17221e]" style={{ fontSize: size * 0.28 }}>
              {Math.round(animatedScore)}
              <span className="text-[10px] font-semibold text-[#718078]">{scoreSuffix}</span>
            </span>
          </div>
        )}
      </div>

      {label && (
        <span className="mt-1 text-[10px] font-semibold tracking-wider text-[#718078] uppercase">
          {label}
        </span>
      )}
    </div>
  );
}
