import { useRef } from "react";
import gsap from "gsap";
export default function Magnetic({ children, className = "", ...props }) {
  const ref = useRef();
  return (
    <button
      ref={ref}
      className={className}
      onPointerMove={(e) => {
        if (
          matchMedia(
            "(pointer:fine) and (prefers-reduced-motion:no-preference)",
          ).matches
        ) {
          const r = e.currentTarget.getBoundingClientRect();
          gsap.to(ref.current, {
            x: (e.clientX - r.left - r.width / 2) * 0.13,
            y: (e.clientY - r.top - r.height / 2) * 0.13,
            duration: 0.4,
          });
        }
      }}
      onPointerLeave={() => gsap.to(ref.current, { x: 0, y: 0, duration: 0.5 })}
      {...props}
    >
      {children}
    </button>
  );
}
