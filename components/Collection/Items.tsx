"use client";

import React from "react";
import Carousel from "./Carousel";
import { getMediaTitle, MediaType, getMediaType } from "../../tmdb/requests";
import Thumbnail from "./Thumbnail";
import { useModalContext } from "../../app/ModalProvider";
import { Movie, Show } from "../../tmdb/types";

interface Props {
  items: Show[] | Movie[];
}

export function Items({ items }: Props) {
  const { openSmallModal } = useModalContext();

  const onHover = (id: number, type: MediaType, thumbnail: HTMLDivElement) => {
    openSmallModal(`${type}-${id}`, thumbnail);
  };

  const itemList = items.map((media) => {
    return (
      <div className="pr-3 lg:pr-5" key={"title" + getMediaTitle(media)}>
        <Thumbnail
          media={media}
          onHover={(thumbnail) =>
            onHover(media.id, getMediaType(media), thumbnail)
          }
          onHoverDelay={300}
        />
      </div>
    );
  });

  return <Carousel>{itemList}</Carousel>;
}
