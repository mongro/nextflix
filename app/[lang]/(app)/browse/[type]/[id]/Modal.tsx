"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  useFloating,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  FloatingPortal,
} from "@floating-ui/react";
import MovieModalContent from "@/components/MovieModal/MovieModalContent";
import { Data, getMediaTitle } from "@/lib/tmdb/requests";
import { useRouter } from "next/navigation";
import { Movie, Show } from "@/lib/tmdb/types";

const variants = {
  visible: { opacity: 1, scale: 1, x: "calc(50vw - 50%)", y: 20 },
  hidden: { opacity: 0, scale: 0.8, y: 20, x: "calc(50vw - 50%)" },
};
interface ModalProps {
  data: Data<"tv" | "movie">;
  similar: (Movie | Show)[];
  trailer: string;
}
export default function Modal({ data, trailer, similar }: ModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  const router = useRouter();

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const role = useRole(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });

  const { getFloatingProps } = useInteractions([role, dismiss]);

  let style = {
    top: 0,
    left: 0,
  };

  return (
    <FloatingPortal id="modal-portal">
      <AnimatePresence>
        {data && isOpen && (
          <div key={data.id}>
            <motion.div
              className="bg-black fixed inset-0"
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.4 }}
            ></motion.div>
            <div
              className={`inset-0 fixed z-50 flex justify-center items-center overflow-y-auto overflow-x-hidden `}
            >
              <FloatingFocusManager context={context}>
                <motion.div
                  variants={variants}
                  initial="hidden"
                  transition={{ duration: 0.2 }}
                  animate="visible"
                  exit="hidden"
                  onAnimationStart={(animation) => {
                    if (animation === "visible") {
                      document.body.classList.add("overflow-hidden", "pr-4");
                    }
                  }}
                  onAnimationComplete={(animation) => {
                    if (animation === "hidden") {
                      document.body.classList.remove("overflow-hidden", "pr-4");
                      router.push("/browse");
                    }
                  }}
                  ref={refs.setFloating}
                  className={`z-50 absolute cursor-pointer shadow-xl rounded overflow-hidden pointer-events-auto w-[95%] max-w-4xl`}
                  {...getFloatingProps()}
                  style={style}
                >
                  {
                    <MovieModalContent
                      onClose={() => setIsOpen(false)}
                      onSizeSwitch={() => {}}
                      cast={data.credits.cast}
                      title={getMediaTitle(data)}
                      details={data}
                      similar={similar}
                      videoUrl={trailer}
                      imageUrl={data.backdrop_path || data.poster_path}
                      state="big"
                    />
                  }
                </motion.div>
              </FloatingFocusManager>
            </div>
          </div>
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
}
