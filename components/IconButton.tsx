import React from "react";
import classNames from "classnames";

type VARIANT = "primary" | "secondary" | "alert";

const VARIANT_MAPS: Record<VARIANT, string> = {
  primary: "text-neutral-800 bg-white hover:bg-white/20 ",
  secondary: "text-white bg-transparent border-neutral-400 hover:border-white",
  alert: "text-cyan-800 bg-white hover:bg-white/20",
};

type SIZE = "small" | "medium" | "big";

const SIZE_MAPS: Record<SIZE, string> = {
  small: "p-2 text-sm",
  medium: "p-3 text-base",
  big: "p-4 text-xl ",
};

interface Props {
  children: React.ReactNode;
  variant?: VARIANT;
  size?: SIZE;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, Props>(
  function IconButton(props, forwardedRef) {
    const {
      children,
      variant = "primary",
      size = "medium",
      className,
      onClick,
      ...buttonProps
    } = props;
    return (
      <button
        className={classNames(
          "flex items-center content-center select-none rounded-full pointer border-2 button-with-icon",
          VARIANT_MAPS[variant],
          SIZE_MAPS[size],
          className
        )}
        onClick={onClick}
        ref={forwardedRef}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
);

export default IconButton;
