import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border border-fb-border bg-fb-white",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export { Card };
