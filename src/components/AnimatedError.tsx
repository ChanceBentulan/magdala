"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function AnimatedError({ id, message }: { id: string; message: string | undefined }) {
  const [rendered, setRendered] = useState(message);
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setRendered(message);
      setVisible(true);
    } else {
      setVisible(false);
      const t = setTimeout(() => setRendered(undefined), 150);
      return () => clearTimeout(t);
    }
  }, [message]);

  if (!rendered) return null;

  return (
    <p
      key={rendered}
      id={id}
      role={visible ? "alert" : undefined}
      className={cn(
        "text-[13px] text-red-400",
        visible ? "motion-safe:animate-error-in" : "motion-safe:animate-error-out"
      )}
    >
      {rendered}
    </p>
  );
}
