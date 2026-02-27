import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1 block text-xs font-semibold text-fb-text-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-md border border-fb-border bg-fb-white px-3 py-2 text-sm text-fb-text placeholder:text-fb-text-muted transition-colors focus:border-fb-blue focus:outline-none",
            error && "border-fb-red",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-fb-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
