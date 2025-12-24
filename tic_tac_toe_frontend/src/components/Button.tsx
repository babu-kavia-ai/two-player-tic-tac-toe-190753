import React from "react";

/**
 * Button component props
 */
export type ButtonVariant = "primary" | "secondary" | "success" | "error" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  // visual
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;

  // state
  disabled?: boolean;
  isLoading?: boolean;

  // content
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;

  // behavior
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

// PUBLIC_INTERFACE
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  onClick,
  type = "button",
}) => {
  const isDisabled = disabled || isLoading;

  // CSS-in-TS style objects. Using inline styles and a generated className to avoid extra dependencies.
  // Theme colors per style guide:
  // primary #3b82f6, secondary #64748b, success #06b6d4, error #EF4444,
  // background #f9fafb, surface #ffffff, text #111827
  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    border: "1px solid transparent",
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.6 : 1,
    width: fullWidth ? "100%" : undefined,
    userSelect: "none",
    transition: "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.02s ease",
    fontWeight: 600,
    lineHeight: 1.2,
    outline: "none",
  };

  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: { fontSize: 14, padding: "8px 12px" },
    md: { fontSize: 16, padding: "10px 16px" },
    lg: { fontSize: 18, padding: "12px 20px" },
  };

  // Establish variant colors
  const variantColors: Record<ButtonVariant, { bg: string; hover: string; active: string; text: string; border?: string }> = {
    primary: {
      bg: "#3b82f6",
      hover: "#2563eb", // darker blue
      active: "#1d4ed8",
      text: "#ffffff",
    },
    secondary: {
      bg: "#64748b",
      hover: "#475569",
      active: "#334155",
      text: "#ffffff",
    },
    success: {
      bg: "#06b6d4",
      hover: "#0891b2",
      active: "#0e7490",
      text: "#0b1220", // readable on cyan
    },
    error: {
      bg: "#EF4444",
      hover: "#dc2626",
      active: "#b91c1c",
      text: "#ffffff",
    },
    ghost: {
      bg: "transparent",
      hover: "rgba(17,24,39,0.06)", // text #111827 at 6% on hover
      active: "rgba(17,24,39,0.12)",
      text: "#111827",
      border: "#e5e7eb",
    },
  };

  const { bg, hover, active, text, border } = variantColors[variant];

  const style: React.CSSProperties = {
    ...baseStyles,
    ...sizeStyles[size],
    color: text,
    backgroundColor: bg,
    borderColor: border ? border : "transparent",
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  };

  // Keyboard focus handling via onFocus/blur styles and data attribute
  const [isFocused, setIsFocused] = React.useState(false);
  if (isFocused && !isDisabled) {
    // accessible focus ring with theme color emphasis
    style.boxShadow = `0 0 0 3px rgba(59,130,246,0.35)`; // primary blue focus halo
  }

  // For hover/active styling without CSS files, we use event handlers to toggle a data state
  const [isHovering, setIsHovering] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  if (!isDisabled) {
    if (isActive) {
      style.backgroundColor = variant === "ghost" ? active : active;
    } else if (isHovering) {
      style.backgroundColor = variant === "ghost" ? hover : hover;
    }
  }

  // Spinner for isLoading
  const spinnerSize = size === "sm" ? 14 : size === "md" ? 16 : 18;
  const Spinner = (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: spinnerSize,
        height: spinnerSize,
        border: `2px solid ${variant === "ghost" ? "#111827" : "#ffffff"}`,
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "kavia-spin 0.8s linear infinite",
      }}
    />
  );

  // Inline keyframes injection (once)
  React.useEffect(() => {
    const id = "kavia-button-keyframes";
    if (!document.getElementById(id)) {
      const styleEl = document.createElement("style");
      styleEl.id = id;
      styleEl.innerHTML = `
        @keyframes kavia-spin { 
          to { transform: rotate(360deg); } 
        }
        /* Reduce motion respect */
        @media (prefers-reduced-motion: reduce) {
          @keyframes kavia-spin { 
            from { transform: rotate(0deg); } 
            to { transform: rotate(0deg); } 
          }
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  return (
    <button
      type={type}
      onClick={isDisabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={className}
      style={style}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {isLoading && (
        <>
          {Spinner}
          <span className="sr-only" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
            Loading
          </span>
        </>
      )}
      {!isLoading && leftIcon ? <span style={{ display: "inline-flex", alignItems: "center" }}>{leftIcon}</span> : null}
      <span style={{ display: "inline-flex", alignItems: "center" }}>{children}</span>
      {!isLoading && rightIcon ? <span style={{ display: "inline-flex", alignItems: "center" }}>{rightIcon}</span> : null}
    </button>
  );
};

export default Button;

/**
 * Usage example:
 *
 * import { Button } from "./components";
 *
 * export function Example() {
 *   return (
 *     <div style={{ display: "flex", gap: 12 }}>
 *       <Button variant="primary" onClick={() => alert("Clicked!")}>
 *         Primary
 *       </Button>
 *       <Button variant="secondary" size="sm">
 *         Secondary Small
 *       </Button>
 *       <Button variant="success" isLoading>
 *         Saving...
 *       </Button>
 *       <Button variant="error" disabled>
 *         Disabled Error
 *       </Button>
 *       <Button variant="ghost" fullWidth>
 *         Ghost Full Width
 *       </Button>
 *     </div>
 *   );
 * }
 */
