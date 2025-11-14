import { useContext, forwardRef, isValidElement, cloneElement } from "react";
import { useTooltipContext } from "./tooltip-context";
import { useMergeRefs } from "@floating-ui/react";
import { Slot } from "@radix-ui/react-slot";

export interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const TooltipTrigger = forwardRef(function TooltipTrigger(
  props: TooltipTriggerProps,
  propRef
) {
  const { children, asChild = false } = props;
  const { triggerProps, setTrigger } = useTooltipContext();

  const ref = useMergeRefs([setTrigger, propRef]);

  const Component = asChild ? Slot : "button";

  return (
    <Component ref={ref} {...triggerProps}>
      {children}
    </Component>
  );
});
