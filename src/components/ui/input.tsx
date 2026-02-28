import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, style, ...props }, ref) => {
    return (
      <div style={{ width: "100%", marginBottom: "6px" }}>
        {label && (
          <label
            htmlFor={id}
            style={{
              display: "block",
              fontSize: "11px",
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              color: "#555",
              marginBottom: "2px",
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          style={{
            width: "100%",
            height: "22px",
            fontSize: "11px",
            fontFamily: "Arial, sans-serif",
            border: error ? "1px solid #cc0000" : "1px solid #ccc",
            padding: "0 4px",
            color: "#333",
            outline: "none",
            boxSizing: "border-box",
            ...style,
          }}
          {...props}
        />
        {error && (
          <p
            style={{
              fontSize: "11px",
              fontFamily: "Arial, sans-serif",
              color: "#cc0000",
              margin: "2px 0 0",
            }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
