"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

interface CountUpProps {
  target: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  formatter?: (value: number) => string;
  triggerOnView?: boolean;
}

export function CountUp({
  target,
  duration = 1.5,
  delay = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  formatter,
  triggerOnView = true,
}: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (triggerOnView && !isInView) return;
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.19, 1, 0.22, 1],
      onUpdate(value) {
        setDisplayValue(value);
      },
    });

    return () => controls.stop();
  }, [target, duration, delay, isInView, triggerOnView]);

  const formatted = formatter
    ? formatter(displayValue)
    : decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toLocaleString("en-IN");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
