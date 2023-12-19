"use client";

import React, { useCallback } from "react";
import Thumbnail from "../../../components/Collection/Thumbnail";
import { getMediaType, isShowOrMovie, MediaType } from "../../../tmdb/requests";
import { useModalContext } from "../../ModalProvider";
import { Movie, Show } from "../../../tmdb/types";
import MovieThumbnail from "../../../components/Collection/MovieThumbnail";

interface Props {
  collection: (Movie | Show)[];
}

function SearchGallery({ collection }: Props) {
  return (
    <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-16">
      {collection.map(
        (media) =>
          isShowOrMovie(media) && (
            <MovieThumbnail key={media.id} media={media} />
          )
      )}
    </div>
  );
}

export default SearchGallery;
