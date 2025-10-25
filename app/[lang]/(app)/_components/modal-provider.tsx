"use client";
import { useQueryState } from "nuqs";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  use,
  Suspense,
} from "react";
import { MediaType } from "@/lib/tmdb/requests";
import Container from "@/components/MovieModal/Container";

interface Props {
  children: React.ReactNode;
}

export interface ModalContextType {
  openSmallModal: (
    id: modalId,
    reference: HTMLElement,
    options?: Partial<ModalOptions>
  ) => void;
  openBigModal: (id: modalId, options?: Partial<ModalOptions>) => void;
  closeModalIfExpanded: () => void;
  setBigModalQueryParam: (id: modalId, options?: Partial<ModalOptions>) => void;
  closeModal: () => void;
  closeModalWithoutAnimation: () => void;
}

export type ModalState = "small" | "big" | "hidden";

export interface ModalOptions {
  closeOnMyListRemove: boolean;
  exitAnimation: boolean;
  thumbnailToPreviewRatio: number;
}

export type State = {
  current: ModalState;
  previous: ModalState;
  id: modalId | null;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function useModalContext() {
  let context = useContext(ModalContext);
  if (context === null) {
    throw Error("Used ModalContext outside Provider");
  }

  return context;
}

const defaultOptions = {
  exitAnimation: true,
  closeOnMyListRemove: false,
  thumbnailToPreviewRatio: 1.5,
};

export type modalId = `${MediaType}-${number}`;
type RequestParams = { id: number; type: MediaType };
export function getRequestParamsFromId(id: modalId): RequestParams;
export function getRequestParamsFromId(id: string): RequestParams | null;
export function getRequestParamsFromId(id: string) {
  const params = id.split("-", 2);
  if (params.length != 2) return null;
  if (
    (params[0] === "tv" || params[0] === "movie") &&
    /^[0-9]*$/.test(params[1])
  ) {
    return { type: params[0], id: +params[1] };
  }
  return null;
}

const isValidModalId = (id: string): id is modalId => {
  return getRequestParamsFromId(id) != null;
};

const BigModalController = () => {
  const [queryId, setQueryId] = useQueryState("id", { history: "push" });
  const { openBigModal, closeModalIfExpanded } = useModalContext();
  useEffect(() => {
    if (queryId) {
      if (isValidModalId(queryId)) {
        openBigModal(queryId);
      }
    } else closeModalIfExpanded();
  }, [queryId, openBigModal, closeModalIfExpanded]);

  return null;
};

function ModalProvider({ children }: Props) {
  const [state, setState] = useState<State>({
    current: "hidden",
    previous: "hidden",
    id: null,
  });
  const [options, setOptions] = useState<ModalOptions>(defaultOptions);
  const [reference, setReference] = useState<HTMLElement | null>(null);

  const openSmallModal = useCallback(
    (id: modalId, reference: HTMLElement, options?: Partial<ModalOptions>) => {
      setReference(reference);
      setOptions({ ...defaultOptions, ...options });
      setState({ current: "small", previous: "hidden", id });
    },
    []
  );

  const openBigModal = useCallback(
    (id: modalId, options?: Partial<ModalOptions>) => {
      if (state.id !== id) setReference(null);
      setState((state) => ({ current: "big", previous: state.current, id }));
      setOptions({ ...defaultOptions, ...options });
    },
    [state.id]
  );

  const setBigModalQueryParam = useCallback(
    (id: modalId, options?: Partial<ModalOptions>) => {
      const params = new URLSearchParams(window.location.search);
      params.set("id", id);
      window.history.pushState(null, "", `?${params.toString()}`);
      setOptions({ ...defaultOptions, ...options });
    },
    []
  );

  const closeModalIfExpanded = useCallback(() => {
    setState((state) => ({
      ...state,
      current: state.current === "big" ? "hidden" : state.current,
      previous: state.current,
    }));
  }, []);

  const closeModal = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const queryId = params.get("id");
    if (queryId) {
      params.delete("id");
      window.history.pushState(null, "", `?${params.toString()}`);
    }
    setState((state) => ({
      ...state,
      current: "hidden",
      previous: state.current,
    }));
  }, []);

  const closeModalWithoutAnimation = useCallback(() => {
    setOptions({ ...defaultOptions, exitAnimation: false });
    closeModal();
  }, [closeModal]);

  const modalContext = useMemo(
    () => ({
      openSmallModal,
      openBigModal,
      closeModalIfExpanded,
      setBigModalQueryParam,
      closeModal,
      closeModalWithoutAnimation,
    }),
    [
      closeModal,
      closeModalIfExpanded,
      setBigModalQueryParam,
      openSmallModal,
      openBigModal,
      closeModalWithoutAnimation,
    ]
  );

  return (
    <ModalContext.Provider value={modalContext}>
      <Suspense>
        <BigModalController />
      </Suspense>
      {state.id && (
        <Container
          key={reference?.dataset.collection + "-" + reference?.dataset.title}
          modalId={state.id}
          reference={reference}
          state={state}
          modalContext={modalContext}
          options={options}
        />
      )}
      {children}
    </ModalContext.Provider>
  );
}

export default ModalProvider;
