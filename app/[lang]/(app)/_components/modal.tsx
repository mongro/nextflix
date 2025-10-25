"use client";
import { useMemo, useRef, useEffect } from "react";
import {
  useFloating,
  offset,
  safePolygon,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
  MiddlewareArguments,
  Rect,
} from "@floating-ui/react";
import { AnimatePresence, m, Variants } from "framer-motion";

import React from "react";
import {
  ModalContextType,
  ModalOptions,
  ModalState,
  State,
} from "./modal-provider";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const finalShift = {
  name: "finalShift",
  fn({ x, y, middlewareData, rects, elements }: MiddlewareArguments) {
    if (!middlewareData.shift) return {};

    const xFinal =
      middlewareData.shift.x > 0
        ? rects.reference.x
        : middlewareData.shift.x < 0
        ? rects.reference.x + rects.reference.width - rects.floating.width
        : x;
    const yFinal =
      middlewareData.shift.y > 0
        ? rects.reference.y
        : middlewareData.shift.y < 0
        ? rects.reference.y + rects.reference.height - rects.floating.height
        : y;

    return {
      x: xFinal,
      y: yFinal,
      data: {
        x: middlewareData.shift.x + (xFinal - x),
        y: middlewareData.shift.y + (yFinal - y),
        referenceRect: rects.reference,
        floatingRect: rects.floating,
        floatingElement: elements.floating,
        referenceElement: elements.reference,
      },
    };
  },
};

interface variantProps {
  thumbnail: Rect;
  x: number | null;
  y: number | null;
  previousState: ModalState;
  thumbnailToPreviewRatio: number;
  modalWidth: number;
  windowWidth: number;
  exitAnimation: boolean;
}

const variants = {
  big: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0.7 },
};

const variantsFlexibleModal: Variants = {
  hidden: ({
    thumbnail,
    modalWidth,
    exitAnimation,
    previousState,
    thumbnailToPreviewRatio,
  }: variantProps) =>
    exitAnimation
      ? {
          x: thumbnail.x,
          y: thumbnail.y,
          scale:
            previousState === "big"
              ? thumbnail.width / modalWidth
              : 1 / thumbnailToPreviewRatio,
        }
      : {},
  small: ({ x, y }: variantProps) => ({ x: x || 0, y: y || 0, scale: 1 }),
  big: ({ thumbnail, modalWidth, thumbnailToPreviewRatio }: variantProps) => {
    return {
      x: "calc(50vw - 50%)",
      y: 20,
      scale: [
        Math.floor(thumbnail.width * thumbnailToPreviewRatio) / modalWidth,
        1,
      ],
    };
  },
};

interface Props {
  reference: HTMLElement | null;
  children?: React.ReactNode;
  state: State;
  modalContext: ModalContextType;
  options: ModalOptions;
}

function Modal({ reference, state, modalContext, options, children }: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const { closeModal } = modalContext;
  const isBig = state.current === "big";
  const isHidden = state.current === "hidden";
  const { thumbnailToPreviewRatio, exitAnimation } = options;
  const modalWidth = 900;

  useEffect(() => {
    if (!modalRef.current) return;
    if (isBig) {
      disableBodyScroll(modalRef.current, {
        reserveScrollBarGap: true,
      });
    }
  }, [isBig]);

  const ref = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (node !== null) {
        modalRef.current = node;
        if (isBig)
          disableBodyScroll(node, {
            reserveScrollBarGap: true,
          });
      } else if (!isBig && modalRef.current) enableBodyScroll(modalRef.current);
    },
    [isBig]
  );

  const onOpenChange = (open: boolean) => {
    if (!open) {
      console.log("close modal");
      closeModal();
    }
  };

  const { x, y, refs, strategy, context, elements } = useFloating({
    open: !isHidden,
    onOpenChange: onOpenChange,
    placement: "bottom",
    elements: { reference },
    middleware: [
      offset(({ rects }) => {
        return -rects.reference.height / 2 - rects.floating.height / 2;
      }),

      shift({ crossAxis: true }),
      finalShift,
    ],
  });

  const hover = useHover(context, {
    enabled: !isBig,
    handleClose: safePolygon({ blockPointerEvents: false }),
    delay: {
      open: 100,
      close: 0,
    },
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });
  // Role props for screen readers
  const role = useRole(context, { role: "dialog" });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);
  const referenceRect = elements.reference?.getBoundingClientRect();

  let defaultStyle = {
    position: strategy,
    top: referenceRect ? 0 : 20,
    left: referenceRect ? 0 : "auto",
    transformOrigin: referenceRect ? "top left" : "center top",
  };

  const style = isBig
    ? { ...defaultStyle }
    : {
        ...defaultStyle,
        width: (referenceRect?.width || 200) * thumbnailToPreviewRatio,
      };

  const variantProps = useMemo(
    () => ({
      x,
      y,
      modalWidth,
      thumbnailToPreviewRatio,
      thumbnail: referenceRect,
      previousState: state.previous,
      exitAnimation: exitAnimation,
    }),
    [
      x,
      y,
      thumbnailToPreviewRatio,
      modalWidth,
      referenceRect,
      state.previous,
      exitAnimation,
    ]
  );

  return (
    <FloatingPortal id="preview-Modal">
      <AnimatePresence custom={variantProps}>
        {!isHidden && (
          <div key="modal" ref={ref}>
            {isBig && (
              <m.div
                className="bg-black fixed inset-0"
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.4 }}
              ></m.div>
            )}
            <div
              className={`inset-0 fixed z-50 flex justify-center ${
                isBig
                  ? "overflow-y-auto overflow-x-hidden"
                  : "pointer-events-none"
              }`}
            >
              {
                <FloatingFocusManager context={context}>
                  <m.div
                    custom={variantProps}
                    variants={referenceRect ? variantsFlexibleModal : variants}
                    initial="hidden"
                    style={style}
                    animate={state.current}
                    transition={{ duration: 0.2 }}
                    exit={exitAnimation ? "hidden" : undefined}
                    onAnimationComplete={(event) => {
                      if (event === "hidden" && modalRef.current) {
                        enableBodyScroll(modalRef.current);
                      }
                    }}
                    ref={refs.setFloating}
                    className={`z-50  cursor-pointer shadow-xl rounded overflow-hidden pointer-events-auto ${
                      isBig ? "w-[95%] max-w-4xl" : ""
                    }`}
                    {...getFloatingProps()}
                  >
                    {children}
                  </m.div>
                </FloatingFocusManager>
              }
            </div>
          </div>
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
}

export default Modal;
