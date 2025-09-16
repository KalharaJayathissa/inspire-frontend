"use client";
import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

const Counter = ({
  target,
  duration = 2,
  suffix = "",
}: {
  target: number;
  duration?: number;
  suffix?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (value) => {
        if (ref.current) {
          ref.current.textContent = Math.floor(value).toString() + suffix;
        }
      },
    });

    return () => controls.stop();
  }, [target, duration, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

export default Counter;
