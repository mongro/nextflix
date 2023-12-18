import { useQuery } from "@tanstack/react-query";
import {
  ModalContextType,
  ModalOptions,
  State,
  getRequestParamsFromId,
  modalId,
} from "../../app/ModalProvider";
import { getMediaTitle, getModalInfos, getSimilar } from "../../tmdb/requests";
import MovieModalContent from "./MovieModalContent";
import { useMemo } from "react";
import { useDictionary } from "../../app/DictionaryProvider";
import Modal from "../../app/Modal";

interface Props {
  modalId: modalId;
  state: State;
  modalContext: ModalContextType;
  options: ModalOptions;
  reference: HTMLElement | null;
}

export default function Container({
  modalId,
  state,
  modalContext,
  options,
  reference,
}: Props) {
  const { type, id } = getRequestParamsFromId(modalId);
  const isBig = state.current === "big";
  const isHidden = state.current === "hidden";
  const { closeModal, closeModalWithoutAnimation, switchToBigModal } =
    modalContext;

  const { lang } = useDictionary();
  const { data: similar } = useQuery({
    queryKey: ["similar", id, type, lang],
    queryFn: () => getSimilar(Number(id), type, lang),
    enabled: isBig,
  });
  const { data } = useQuery({
    queryKey: ["data", id, type, lang],
    queryFn: () => getModalInfos(id, type, lang),
    enabled: !isHidden,
  });

  const trailer = useMemo(() => {
    if (data) {
      const videos = data.videos.results;
      if (videos.length < 1) return undefined;
      const trailerIndex = videos.findIndex(
        (video) => video.type === "Trailer"
      );
      return trailerIndex > -1 ? videos[trailerIndex].key : videos[0].key;
    } else return undefined;
  }, [data]);

  return (
    data && (
      <Modal
        reference={reference}
        state={state}
        options={options}
        modalContext={modalContext}
      >
        <MovieModalContent
          onClose={closeModal}
          onMyListRemove={() => {
            if (options.closeOnMyListRemove) {
              closeModalWithoutAnimation();
            }
          }}
          onSizeSwitch={(event) => {
            switchToBigModal(modalId, {
              closeOnMyListRemove: false,
            });
          }}
          cast={data.credits.cast}
          title={getMediaTitle(data)}
          details={data}
          similar={similar?.results}
          videoUrl={trailer}
          imageUrl={data.backdrop_path || data.poster_path}
          state={state.current}
        />
      </Modal>
    )
  );
}
