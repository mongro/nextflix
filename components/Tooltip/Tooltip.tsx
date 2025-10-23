import {
  autoUpdate,
  flip,
  offset,
  Placement,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { TooltipContext } from "./TooltipContext";
import { useMemo, useState } from "react";
export interface TooltipProps {
  placement: Placement;
  children: React.ReactNode;
  delay?: number;
  closeDelay?: number;
}

export function Tooltip({
  children,
  placement,
  delay = 200,
  closeDelay = 0,
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes("-"),
        fallbackAxisSideDirection: "start",
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
  });

  const context = data.context;

  const hover = useHover(context, {
    move: false,
    delay: { close: closeDelay, open: delay },
  });
  const focus = useFocus(context, {});
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getFloatingProps, getReferenceProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const contextValue: TooltipContext = useMemo(
    () => ({
      open,
      isPositioned: data.isPositioned,
      floatingProps: getFloatingProps(),
      triggerProps: getReferenceProps(),
      setTrigger: data.refs.setReference,
      setFloating: data.refs.setFloating,
      floatingStyles: context.floatingStyles,
    }),
    [open, data, getFloatingProps, getReferenceProps, context]
  );

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  );
}
