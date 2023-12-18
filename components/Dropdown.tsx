import {
  autoUpdate,
  FloatingPortal,
  useFloating,
  offset,
  flip,
  shift,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  useListNavigation,
  useClick,
} from "@floating-ui/react";
import React, { useState } from "react";

interface DropdownProps {
  label: string;
  children?: React.ReactNode;
}

interface MenuItemProps {
  children: React.ReactNode;
}
// eslint-disable-next-line react/display-name
export const MenuItem = React.forwardRef<
  HTMLLIElement,
  MenuItemProps & React.ButtonHTMLAttributes<HTMLLIElement>
>(({ children, ...props }, ref) => {
  return (
    <li {...props} ref={ref} role="menuitem">
      {children}
    </li>
  );
});

export function Dropdown({ children, label }: DropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listItemsRef = React.useRef<Array<HTMLLIElement | null>>([]);

  const { x, y, refs, strategy, context } = useFloating<HTMLButtonElement>({
    open,
    onOpenChange: setOpen,
    placement: "bottom-start",
    middleware: [offset({ mainAxis: 4 }), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const list = useListNavigation(context, {
    listRef: listItemsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    scrollItemIntoView: true,
  });

  const click = useClick(context, { event: "mousedown", toggle: true });
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });
  // Role props for screen readers
  const role = useRole(context, { role: "menu" });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [role, click, list, dismiss]
  );

  console.log(getItemProps());

  return (
    <>
      <button
        className={`flex items-center justify-between cursor-pointer px-4 py-2 dropdown-toggle bg-neutral-900 whitespace-nowrap border border-neutral-400${
          open ? "after:rotate-180	" : "after:transform-none"
        }`}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {label} {""}
      </button>
      <FloatingPortal>
        {open && (
          <ul
            className="dropdown-menu z-50 overflow-auto min-h-[5rem] max-h-[12rem] bg-neutral-900 whitespace-nowrap border border-neutral-400 py-4"
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
            }}
            {...getFloatingProps()}
          >
            {React.Children.map(children, (child, index) => {
              return (
                React.isValidElement(child) &&
                React.cloneElement(
                  child,
                  getItemProps({
                    tabIndex: activeIndex === index ? 0 : -1,
                    role: "menuitem",
                    ref(node: HTMLLIElement) {
                      listItemsRef.current[index] = node;
                    },
                    onClick(event) {
                      child.props.onClick?.(event);
                      setOpen(false);
                      console.log("click");
                    },
                    onKeyDown(event) {
                      console.log("press");
                      if (event.key === "Enter") {
                        child.props.onClick?.(event);
                        setOpen(false);
                      }
                    },
                  })
                )
              );
            })}
          </ul>
        )}
      </FloatingPortal>
    </>
  );
}

export default Dropdown;
