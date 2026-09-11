import { useEffect, useState } from "react";

// Live wall clock, formatted HH:MM:SS.
// (The broadcast countdowns now live in the shared store — see
// src/app/store/useBroadcast.ts. This file only provides the wall clock.)
export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
