import { useEffect, useRef } from "react";
import { useInView, motion, useMotionValue, useSpring } from "framer-motion";

interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
}

export const Counter = ({
  from,
  to,
  duration = 2,
  suffix = "",
}: CounterProps) => {
  const count = useMotionValue(from);
  const rounded = useSpring(count, { duration: duration * 1000, bounce: 0 });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      count.set(to);
    }
  }, [count, to, isInView]);

  return (
    <motion.div ref={ref} className="text-3xl font-bold text-accent mb-2">
      {rounded.get().toFixed(0)}
      {suffix}
    </motion.div>
  );
};
