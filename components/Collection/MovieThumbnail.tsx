"use client";

import React, { useCallback } from "react";
import { ModalOptions, useModalContext } from "../../app/ModalProvider";
import Thumbnail, { ThumbnailProps } from "./Thumbnail";
import { MediaType, getMediaType } from "../../tmdb/requests";

export default function SearchGallery({
  options,
  ...thumbnailProps
}: { options?: Partial<ModalOptions> } & ThumbnailProps) {
  const { openSmallModal } = useModalContext();
  const { media, onHoverDelay } = thumbnailProps;

  const onHover = useCallback(
    (id: number, type: MediaType, thumbnail: HTMLDivElement) => {
      openSmallModal(`${type}-${id}`, thumbnail, options);
    },
    []
  );

  return (
    <Thumbnail
      onHover={(thumbnail) => onHover(media.id, getMediaType(media), thumbnail)}
      {...thumbnailProps}
    />
  );
}
