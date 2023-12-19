import React, { useCallback } from "react";
import { useModalContext } from "../../app/ModalProvider";
import Thumbnail, { ThumbnailProps } from "./Thumbnail";
import { MediaType, getMediaType } from "../../tmdb/requests";

export default function SearchGallery({ onHoverDelay, media }: ThumbnailProps) {
  const { openSmallModal } = useModalContext();

  const onHover = useCallback(
    (id: number, type: MediaType, thumbnail: HTMLDivElement) => {
      openSmallModal(`${type}-${id}`, thumbnail);
    },
    []
  );

  return (
    <Thumbnail
      media={media}
      onHoverDelay={onHoverDelay}
      onHover={(thumbnail) => onHover(media.id, getMediaType(media), thumbnail)}
    />
  );
}
