import { FloatingPortal } from "@floating-ui/react";
import { useTooltipContext } from "./TooltipContext";
import { cn } from "@/lib/utils";

export interface TooltipContentProps {
  children: React.ReactNode;
}

export function TooltipContent(props: TooltipContentProps) {
  const { children } = props;
  const context = useTooltipContext();

  if (!context.open) return null;
  console.log("isPos", context.isPositioned);
  console.log(context.floatingStyles);

  return (
    <FloatingPortal>
      <div
        ref={context.setFloating}
        style={{
          ...context.floatingStyles,
        }}
        {...context.floatingProps}
        className="z-50"
      >
        <div
          className={cn(
            "animate-fade-in bg-primary text-primary-foreground  data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance"
          )}
        >
          {children}
        </div>
      </div>
    </FloatingPortal>
  );
}
