'use client';

import { useState, useEffect } from 'react';

// Launch deadline: 18 days from March 13 2026 = March 31 2026 23:59:59 UTC
const LAUNCH_DEADLINE = new Date('2026-03-31T23:59:59Z');

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calcTimeLeft(): CountdownTime {
  const diff = LAUNCH_DEADLINE.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

export function useCountdown(): CountdownTime {
  const [time, setTime] = useState<CountdownTime>(calcTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
