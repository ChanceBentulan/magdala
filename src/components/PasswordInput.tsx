"use client";

import { useState, type ComponentProps } from "react";

const MASK = "●";

export function PasswordInput({ ref, name, onChange, ...rest }: ComponentProps<"input">) {
  const [real, setReal] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDisplay = e.target.value;
    const oldLength = real.length;

    // Find contiguous block of non-mask chars — the newly inserted content
    let insertStart = -1;
    let insertedText = "";
    for (let i = 0; i < newDisplay.length; i++) {
      if (newDisplay[i] !== MASK) {
        if (insertStart === -1) insertStart = i;
        insertedText += newDisplay[i];
      }
    }

    let newReal: string;
    if (insertedText.length > 0) {
      // Insertion (plain type or paste), possibly replacing a selection
      const netIncrease = newDisplay.length - oldLength;
      const deletedCount = Math.max(0, insertedText.length - netIncrease);
      newReal = real.slice(0, insertStart) + insertedText + real.slice(insertStart + deletedCount);
    } else {
      // Pure deletion (backspace / delete / cut / select-all+delete)
      const newCursor = e.target.selectionStart ?? 0;
      const deletedCount = oldLength - newDisplay.length;
      newReal = real.slice(0, newCursor) + real.slice(newCursor + deletedCount);
    }

    setReal(newReal);
    onChange?.(e);
  };

  return (
    <>
      <input type="hidden" name={name} value={real} />
      <input
        {...rest}
        ref={ref}
        type="text"
        name={undefined}
        value={MASK.repeat(real.length)}
        onChange={handleChange}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
      />
    </>
  );
}
