import React from "react";
import { cn } from "@/utils/cn";

type VARIANT = "primary" | "secondary" | "alert";

const VARIANT_MAPS: Record<VARIANT, string> = {
  primary: "text-neutral-800 bg-white hover:bg-white/20 ",
  secondary:
    "text-white bg-transparent border-neutral-200 border-1 hover:border-white",
  alert: "text-cyan-800 bg-white hover:bg-white/20 ",
};

type SIZE = "small" | "medium" | "big";

const SIZE_MAPS: Record<SIZE, string> = {
  small: "py-1 px-4 text-sm",
  medium: "py-1.5 px-5 text-base",
  big: "py-2 px-6 text-xl",
};

interface Props {
  children: React.ReactNode;
  variant?: VARIANT;
  size?: SIZE;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function Button({
  children,
  variant = "primary",
  size = "medium",
  onClick,
  ...props
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "border-0 flex items-center content-center select-none rounded-md pointer text-bold mr-2 mb-2 button-with-icon [&>svg]:mr-2",
        VARIANT_MAPS[variant],
        SIZE_MAPS[size]
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
