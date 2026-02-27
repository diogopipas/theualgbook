import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-colors focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-fb-blue text-white hover:bg-fb-blue-dark border border-fb-blue-dark":
              variant === "primary",
            "bg-fb-gray-light text-fb-text border border-fb-border hover:bg-fb-border":
              variant === "secondary",
            "text-fb-text-secondary hover:bg-fb-gray-light border border-transparent":
              variant === "ghost",
            "bg-fb-red text-white hover:opacity-90 border border-fb-red":
              variant === "danger",
          },
          {
            "px-2 py-0.5 text-[11px]": size === "sm",
            "px-3 py-1 text-xs": size === "md",
            "px-4 py-1.5 text-sm": size === "lg",
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
