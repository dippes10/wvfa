"use client";

import { useId } from "react";

const TAGLINE =
  "Train Smart · Sleep Well · Play Strong · Recover Right · Grow Together · ".repeat(
    3,
  );

const fadeMask =
  "linear-gradient(to right, transparent, black 8%, black 92%, transparent)";

export function FlowingTagline({
  speed = 32,
  fontSize = 22,
}: {
  speed?: number;
  fontSize?: number;
}) {
  const reactId = useId().replace(/[:]/g, "");
  const pathId = `flow-path-${reactId}`;

  return (
    <div
      className="w-full overflow-hidden py-6"
      style={{ WebkitMaskImage: fadeMask, maskImage: fadeMask }}
    >
      <svg
        viewBox="0 0 1200 160"
        className="h-24 w-full sm:h-28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path id={pathId} fill="transparent" d="M-100 90 C 150 10, 350 170, 600 90 S 1050 10, 1300 90" />
        <text style={{ fontSize }} className="fill-primary/60 font-bold tracking-wide uppercase">
          <textPath href={`#${pathId}`} startOffset="0%">
            {TAGLINE}
            <animate
              attributeName="startOffset"
              from="0%"
              to="-100%"
              dur={`${speed}s`}
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      </svg>
    </div>
  );
}
