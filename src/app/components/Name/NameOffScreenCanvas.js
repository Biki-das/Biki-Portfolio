"use client";

import React from "react";
import clsx from "clsx";

const bigSvgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2304 384">
  <path d="M 1899.08,-513.008" />
  <text
    xml:space="preserve"
    style="font-size: 373.333px; font-family: Arial; opacity: 0.94; fill: currentColor; fill-opacity: 1; fill-rule: evenodd; stroke: none; paint-order: stroke fill markers; pointer-events: none; user-select: none;"
    x="381.18887"
    y="323.84189"
    class="text-neutral-950 dark:text-neutral-50"
  >
    <tspan x="381.18887" y="323.84189">BIKI DAS</tspan>
  </text>
</svg>
`;

const smallSvgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 658">
  <path d="M 1899.08,-513.008" />
  <text
    xml:space="preserve"
    style="font-size: 226.667px; font-family: Arial; opacity: 0.94; fill: currentColor; fill-opacity: 1; fill-rule: evenodd; stroke: none; paint-order: stroke fill markers; pointer-events: none; user-select: none;"
    x="231.18887"
    y="396.84189"
    class="text-neutral-950 dark:text-neutral-50"
  >
    <tspan x="231.18887" y="396.84189">BIKI DAS</tspan>
  </text>
</svg>
`;

const name_big_svg = `data:image/svg+xml;base64,${btoa(bigSvgContent)}`;
const name_small_svg = `data:image/svg+xml;base64,${btoa(smallSvgContent)}`;

function NameOffScreenCanvas({
  isMobile = false,
  isLoaded,
  setIsLoaded,
  environment = "production",
}) {
  const canvasRef = React.useRef(null);
  const [counter, setCounter] = React.useState(0);

  React.useEffect(() => {
    if (environment === "development" && counter === 0) {
      setCounter((prev) => prev + 1);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    // set up webgl canvas worker
    const offscreenCanvas = canvas.transferControlToOffscreen();
    const nameCanvasWorker = new Worker("/workers/nameCanvasWorker.js", {});
    nameCanvasWorker.postMessage(
      {
        command: "init",
        canvas: offscreenCanvas,
        isMobile: isMobile,
      },
      [offscreenCanvas]
    );

    // load name image and send to worker
    let img = new Image();
    img.src = !isMobile ? name_big_svg : name_big_svg;
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      nameCanvasWorker.postMessage({
        command: "setNameTexture",
        image: imageData,
      });
    };

    // toggle mode uniform's value
    function handleModeToggle() {
      nameCanvasWorker.postMessage({ command: "toggleModeUniform" });
    }
    canvas.addEventListener("click", handleModeToggle);

    // set up mouse and touch events
    let handleMouseMove = null;
    let handleMouseLeave = null;
    if (!isMobile) {
      handleMouseMove = (event) => {
        const canvasRect = canvas.getBoundingClientRect();
        // normalize position into [0, 1] and flip y
        const x = (event.clientX - canvasRect.left) / canvasRect.width;
        const y = 1 - (event.clientY - canvasRect.top) / canvasRect.height;
        const point = {
          x: x,
          y: y,
        };
        nameCanvasWorker.postMessage({ command: "addPoint", point: point });
        nameCanvasWorker.postMessage({
          command: "updateMousePosition",
          mousePosition: { x, y },
        });
      };
      handleMouseLeave = () => {
        nameCanvasWorker.postMessage({
          command: "updateMousePosition",
          mousePosition: { x: -10000, y: -10000 },
        });
      };
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }
    let handleTouchMove = null;
    let handleTouchEnd = null;
    if (isMobile) {
      handleTouchMove = (event) => {
        const touch = event.touches[0];
        const canvasRect = canvas.getBoundingClientRect();
        // normalize position into [0, 1] and flip y
        const x = (touch.clientX - canvasRect.left) / canvasRect.width;
        const y = 1 - (touch.clientY - canvasRect.top) / canvasRect.height;
        const point = {
          x: x,
          y: y,
        };
        nameCanvasWorker.postMessage({ command: "addPoint", point: point });
        nameCanvasWorker.postMessage({
          command: "updateMousePosition",
          mousePosition: { x, y },
        });
      };
      handleTouchEnd = () => {
        nameCanvasWorker.postMessage({
          command: "updateMousePosition",
          mousePosition: { x: -10000, y: -10000 },
        });
      };
      canvas.addEventListener("touchmove", handleTouchMove);
      canvas.addEventListener("touchend", handleTouchEnd);
    }

    setIsLoaded(true);

    return () => {
      setIsLoaded(false);
      canvas.removeEventListener("click", handleModeToggle);
      if (!isMobile) {
        handleMouseMove &&
          canvas.removeEventListener("mousemove", handleMouseMove);
        handleMouseLeave &&
          canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (isMobile) {
        handleTouchMove &&
          canvas.removeEventListener("touchmove", handleTouchMove);
        handleTouchEnd &&
          canvas.removeEventListener("touchend", handleTouchEnd);
      }
      nameCanvasWorker.postMessage({ command: "cleanUp" });
      nameCanvasWorker.terminate();
    };
  }, [isMobile, setIsLoaded, environment, counter]);

  return (
    <canvas
      ref={canvasRef}
      className={clsx(
        "w-full h-auto cursor-pointer aspect-[700/329] sm:aspect-[2304/384] touch-none select-none",
        isMobile ? "block sm:hidden" : "hidden sm:block",
        isLoaded ? "opacity-100" : "opacity-0"
      )}
    />
  );
}

const MemoizedNameOffScreenCanvas = React.memo(NameOffScreenCanvas);
export default MemoizedNameOffScreenCanvas;
