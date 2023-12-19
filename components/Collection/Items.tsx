"use client";

import React from "react";
import Carousel from "./Carousel";
import { getMediaTitle, MediaType, getMediaType } from "../../tmdb/requests";
import { Movie, Show } from "../../tmdb/types";
import MovieThumbnail from "./MovieThumbnail";

interface Props {
  items: Show[] | Movie[];
}

export function Items({ items }: Props) {
  const itemList = items.map((media) => {
    return (
      <div className="pr-3 lg:pr-5" key={"title" + getMediaTitle(media)}>
        <MovieThumbnail media={media} onHoverDelay={300} />
      </div>
    );
  });

  return <Carousel>{itemList}</Carousel>;
}
