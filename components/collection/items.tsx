"use client";

import React from "react";
import Carousel from "./carousel";
import { Movie, Show } from "@/lib/tmdb/types";
import MovieThumbnail from "./movie-thumbnail";

interface Props {
  items: Show[] | Movie[];
  collection: string;
}

export function Items({ items, collection }: Props) {
  const itemList = items.map((media) => {
    return (
      <div className="pr-3 lg:pr-5" key={media.id}>
        <MovieThumbnail
          media={media}
          onHoverDelay={300}
          collection={collection}
        />
      </div>
    );
  });

  return <Carousel>{itemList}</Carousel>;
}
