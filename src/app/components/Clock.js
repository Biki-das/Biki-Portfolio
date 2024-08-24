"use client";

import React from "react";
import clsx from "clsx";

export default function Clock({ className = "" }) {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const raw = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  const [timePart, amPm] = raw.split(" ");
  const [hour, minute, second] = timePart.split(":");

  return (
    <div
      className={clsx(
        "text-base sm:text-sm font-geistmono font-medium text-center flex flex-row sm:flex-col gap-2 sm:gap-0 lg:gap-2 lg:flex-row justify-center items-center",
        className
      )}
    >
      <p>
        <span suppressHydrationWarning>{hour.padStart(2, "0")}</span>
        <span className="text-neutral-500">:</span>
        <span suppressHydrationWarning>{minute}</span>
        <span className="text-neutral-500">:</span>
        <span suppressHydrationWarning>{second}</span>
        <span className="ml-1 text-xs">{amPm}</span>
      </p>
      <span className="text-neutral-500 block sm:hidden lg:block"> IST</span>
      <span className="text-neutral-500 hidden sm:block lg:hidden">
        {" "}
        Kolkata
      </span>
    </div>
  );
}
