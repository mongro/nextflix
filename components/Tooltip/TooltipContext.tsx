import { createContext, CSSProperties, useContext } from "react";

export interface TooltipContext {
  open: boolean;
  triggerProps: Record<string, unknown>;
  floatingProps: Record<string, unknown>;
  setTrigger: (el: Element | null) => void;
  setFloating: (el: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
}

export const TooltipContext = createContext<TooltipContext | undefined>(
  undefined
);

export const useTooltipContext = () => {
  const context = useContext(TooltipContext);

  if (context == undefined) {
    throw new Error("Tooltip components must be wrapped in <Tooltip />");
  }
  return context;
};
