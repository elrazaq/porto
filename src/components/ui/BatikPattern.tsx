import React from "react";

interface BatikPatternProps {
  variant?: "kawung" | "parang" | "ornament";
  className?: string;
  opacity?: number;
}

export function BatikPattern({
  variant = "kawung",
  className = "",
  opacity = 0.04,
}: BatikPatternProps) {
  if (variant === "ornament") {
    return (
      <svg
        className={`pointer-events-none absolute ${className}`}
        width="120"
        height="120"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        <path
          d="M50 0C50 27.614 27.614 50 0 50C27.614 50 50 72.386 50 100C50 72.386 72.386 50 100 50C72.386 50 50 27.614 50 0Z"
          fill="currentColor"
        />
        <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="2" fill="currentColor" />
      </svg>
    );
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${
        variant === "parang" ? "bg-batik-parang" : "bg-batik-kawung"
      } ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
