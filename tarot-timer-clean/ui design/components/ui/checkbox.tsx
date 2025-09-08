"use client";

import * as React from "react";
import { Check } from "./icons";
import { cn } from "./utils";

function Checkbox({
  className,
  checked,
  onCheckedChange,
  ...props
}: React.ComponentProps<"input"> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...props}
      />
      <div
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary text-primary-foreground" : "bg-background",
          className
        )}
      >
        {checked && (
          <Check className="h-3.5 w-3.5 text-current" />
        )}
      </div>
    </label>
  );
}

export { Checkbox };