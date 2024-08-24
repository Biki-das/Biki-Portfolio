"use client";

import React from "react";
import clsx from "clsx";
import NameOffScreenCanvas from "./NameOffScreenCanvas";
import VisuallyHidden from "@/components/VisuallyHidden";
import useWindowBreakpoints from "@/hooks/useWindowBreakpoints";

export default function Name() {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const breakpoint = useWindowBreakpoints({
    isMobile: true,
  });
  const environment = process.env.NODE_ENV;

  return (
    <div className="w-full h-auto aspect-[700/329] sm:aspect-[2304/384]">
      <svg
        viewBox="0 0 2304 384"
        version="1.1"
        id="svg1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsSvg="http://www.w3.org/2000/svg"
        className={clsx(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto z-10 pointer-events-none",
          "block sm:block"
        )}
      >
        <defs id="defs1" />
        <path d="M 1899.08,-513.008" id="path1-4" />
        <text
          xmlSpace="preserve"
          style={{
            fontSize: "373.333px",
            fontFamily: "Arial",
            opacity: 0.94,
            fill: "currentColor",
            fillOpacity: 1,
            fillRule: "evenodd",
            stroke: "none",
            paintOrder: "stroke fill markers",
            pointerEvents: "none",
            userSelect: "none",
          }}
          x="381.18887"
          y="323.84189"
          id="text4"
          className="text-neutral-950 dark:text-neutral-50"
        >
          <tspan sodipodiRole="line" id="tspan4" x="381.18887" y="323.84189">
            BIKI DAS
          </tspan>
        </text>
      </svg>
      {breakpoint === "xs" && (
        <NameOffScreenCanvas
          isMobile
          isLoaded={isLoaded}
          setIsLoaded={setIsLoaded}
          environment={environment}
        />
      )}
      {breakpoint === "sm" && (
        <NameOffScreenCanvas
          isLoaded={isLoaded}
          setIsLoaded={setIsLoaded}
          environment={environment}
        />
      )}
      <VisuallyHidden>
        <h1>Biki Das</h1>
      </VisuallyHidden>
    </div>
  );
}
