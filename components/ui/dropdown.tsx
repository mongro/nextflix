import { cn } from "@/lib/utils";
import {
  autoUpdate,
  flip,
  FloatingContext,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from "@floating-ui/react";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

const MenuContext = React.createContext<{
  getItemProps: (
    userProps?: React.HTMLProps<HTMLElement>
  ) => Record<string, unknown>;
  getFloatingProps: (
    userProps?: React.HTMLProps<HTMLElement>
  ) => Record<string, unknown>;
  getReferenceProps: (
    userProps?: React.HTMLProps<HTMLElement>
  ) => Record<string, unknown>;
  activeIndex: number | null;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setHasFocusInside: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  setTrigger: (el: HTMLElement | null) => void;
  setFloating: (el: HTMLElement | null) => void;
  context: FloatingContext;
  isNested: boolean;
  elementsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  labelsRef: React.MutableRefObject<(string | null)[]>;
  floatingStyles: React.CSSProperties;
} | null>(null);

export const useMenuContext = () => {
  const context = React.useContext(MenuContext);

  if (context == null) {
    throw new Error("Menu components must be wrapped in <DropdownMenu />");
  }
  return context;
};

type MenuProps = {
  label: string;
  className?: string;
  nested?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
} & React.HTMLProps<HTMLButtonElement>;

export const MenuComponent = ({
  children,
  className,
  label,
  ref,
  ...props
}: MenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasFocusInside, setHasFocusInside] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const elementsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);
  const parent = React.useContext(MenuContext);

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const item = useListItem();

  const isNested = parent != null;

  const { floatingStyles, refs, context } = useFloating<HTMLButtonElement>({
    nodeId,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: isNested ? "right-start" : "bottom-start",
    middleware: [
      offset({ mainAxis: isNested ? 0 : 4, alignmentAxis: isNested ? -4 : 0 }),
      flip(),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    enabled: isNested,
    delay: { open: 75 },
    handleClose: safePolygon({ blockPointerEvents: true }),
  });
  const click = useClick(context, {
    event: "mousedown",
    toggle: !isNested,
    ignoreMouse: isNested,
  });
  const role = useRole(context, { role: "menu" });
  const dismiss = useDismiss(context, { bubbles: true });
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    nested: isNested,
    onNavigate: setActiveIndex,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    onMatch: isOpen ? setActiveIndex : undefined,
    activeIndex,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [hover, click, role, dismiss, listNavigation, typeahead]
  );

  const mergedRef = useMergeRefs([refs.setReference, item.ref, ref]);

  // Event emitter allows you to communicate across tree components.
  // This effect closes all menus when an item gets clicked anywhere
  // in the tree.
  React.useEffect(() => {
    if (!tree) return;

    function handleTreeClick() {
      setIsOpen(false);
    }

    function onSubMenuOpen(event: { nodeId: string; parentId: string }) {
      if (event.nodeId !== nodeId && event.parentId === parentId) {
        setIsOpen(false);
      }
    }

    tree.events.on("click", handleTreeClick);
    tree.events.on("menuopen", onSubMenuOpen);

    return () => {
      tree.events.off("click", handleTreeClick);
      tree.events.off("menuopen", onSubMenuOpen);
    };
  }, [tree, nodeId, parentId]);

  React.useEffect(() => {
    if (isOpen && tree) {
      tree.events.emit("menuopen", { parentId, nodeId });
    }
  }, [tree, isOpen, nodeId, parentId]);

  return (
    <FloatingNode id={nodeId}>
      {isNested && (
        <button
          ref={mergedRef}
          tabIndex={parent.activeIndex === item.index ? 0 : -1}
          role="menuitem"
          data-open={isOpen ? "" : undefined}
          data-nested={isNested ? "" : undefined}
          data-focus-inside={hasFocusInside ? "" : undefined}
          className={isNested ? "MenuItem" : "RootMenu"}
          {...getReferenceProps(
            parent.getItemProps({
              ...props,
              onFocus(event: React.FocusEvent<HTMLButtonElement>) {
                props.onFocus?.(event);
                setHasFocusInside(false);
                parent.setHasFocusInside(true);
              },
            })
          )}
        >
          {label}
          <span aria-hidden style={{ marginLeft: 10, fontSize: 10 }}>
            ▶
          </span>
        </button>
      )}
      <MenuContext.Provider
        value={{
          setTrigger: refs.setReference,
          setFloating: refs.setFloating,
          activeIndex,
          setActiveIndex,
          getItemProps,
          getReferenceProps,
          setHasFocusInside,
          isOpen,
          isNested,
          context,
          getFloatingProps,
          floatingStyles,
          elementsRef,
          labelsRef,
        }}
      >
        {children}
      </MenuContext.Provider>
    </FloatingNode>
  );
};

type MenuPortal = {
  children: React.ReactElement;
};

export const MenuPortal = ({ children }: MenuPortal) => {
  const { isOpen, context, elementsRef, isNested, labelsRef } =
    useMenuContext();
  return (
    <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager
            context={context}
            modal={false}
            initialFocus={isNested ? -1 : 0}
            returnFocus={!isNested}
          >
            {children}
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </FloatingList>
  );
};

type MenuContent = {
  children?: React.ReactNode;
  className?: string;
};

export const MenuContent = ({ children, className }: MenuContent) => {
  const { floatingStyles, getFloatingProps, setFloating } = useMenuContext();

  return (
    <div
      ref={setFloating}
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      )}
      style={floatingStyles}
      {...getFloatingProps()}
    >
      {children}
    </div>
  );
};

type MenuItemProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  disabled?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const MenuItem = ({
  label,
  asChild,
  children,
  disabled,
  className,
  ref,
  ...props
}: MenuItemProps) => {
  const menu = useMenuContext();
  const item = useListItem({ label: disabled ? null : label });
  const tree = useFloatingTree();
  const isActive = item.index === menu.activeIndex;

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      {...props}
      ref={useMergeRefs([item.ref, ref])}
      type="button"
      role="menuitem"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      {...menu.getItemProps({
        onClick(event: React.MouseEvent<HTMLButtonElement>) {
          props.onClick?.(event);
          tree?.events.emit("click");
        },
        onFocus(event: React.FocusEvent<HTMLButtonElement>) {
          props.onFocus?.(event);
          menu.setHasFocusInside(true);
        },
      })}
    >
      {children}
    </Comp>
  );
};

export function DropdownTrigger({
  asChild = false,
  ...props
}: React.ComponentPropsWithRef<"button"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button";
  const { setTrigger, getReferenceProps, isOpen } = useMenuContext();
  const ref = useMergeRefs([setTrigger, props.ref]);

  return (
    <Comp
      data-slot="button"
      {...props}
      {...getReferenceProps()}
      ref={ref}
      className={cn(
        "after:content-['^']",
        isOpen ? "after:rotate-180	" : "after:transform-none"
      )}
    />
  );
}

type DropdownMenuProps = {
  label: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
} & React.HTMLProps<HTMLButtonElement>;

export const DropdownMenu = ({ ref, ...props }: DropdownMenuProps) => {
  const parentId = useFloatingParentNodeId();

  if (parentId === null) {
    return (
      <FloatingTree>
        <MenuComponent {...props} ref={ref} />
      </FloatingTree>
    );
  }

  return <MenuComponent {...props} ref={ref} />;
};
