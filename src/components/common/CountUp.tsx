"use client";

import { useEffect, useState } from "react";

import { Typography } from "@/components/common/Typography";

interface CountUpProps {
  value: number;
  durationMs?: number;
  prefix?: string;
  className?: string;
}

// Animates from 0 to `value` with an ease-out curve, formatted in the Indian
// numbering system. Skips straight to the final value for users who prefer
// reduced motion.
export const CountUp = ({
  value,
  durationMs = 1500,
  prefix = "",
  className,
}: CountUpProps) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = reduceMotion
        ? 1
        : Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [value, durationMs]);

  return (
    <Typography as="span" className={className}>
      {prefix}
      {display.toLocaleString("en-IN")}
    </Typography>
  );
};
