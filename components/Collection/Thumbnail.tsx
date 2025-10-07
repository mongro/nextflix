"use client";
import React, { useRef, memo, useEffect } from "react";
import Image from "../ImageWithTmdbUrl";
import { getMediaTitle } from "../../tmdb/requests";
import { Movie, MovieDetails, Show, ShowDetails } from "../../tmdb/types";

export interface ThumbnailProps {
  onHoverDelay?: number;
  media: Movie | Show | ShowDetails | MovieDetails;
  onHover?: (thumbnail: HTMLDivElement) => void;
  collection: string;
}
const Thumbnail = memo(
  ({ media, onHoverDelay = 500, onHover, collection }: ThumbnailProps) => {
    const timerId = useRef<number | null>(null);
    const thumbnailRef = useRef<HTMLDivElement | null>(null);

    const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
      timerId.current = window.setTimeout(() => {
        if (thumbnailRef.current && onHover) onHover(thumbnailRef.current);
      }, onHoverDelay);
    };

    const cancelTimer = (event: React.MouseEvent<HTMLDivElement>) => {
      if (timerId.current) window.clearTimeout(timerId.current);
    };

    const style: React.CSSProperties = {
      transitionDuration: `${onHoverDelay / 1000}s`,
      transitionTimingFunction: "linear",
    };

    const src = media.backdrop_path || media.poster_path;
    const title = getMediaTitle(media);
    return (
      <div
        className="w-full relative cursor-pointer aspect-video rounded overflow-hidden group "
        ref={thumbnailRef}
        data-testid="thumbnail"
        data-collection={collection}
        data-title={getMediaTitle(media)}
        onMouseLeave={cancelTimer}
        onMouseEnter={handleMouseEnter}
      >
        {src && (
          <Image
            className="object-cover"
            src={media.backdrop_path || media.poster_path}
            alt={title}
            fill
            sizes="384px"
          />
        )}
        <div className="inset-0 absolute flex justify-center items-center -z-10 text-neutral-50 bg-neutral-900">
          <span>{title}</span>
        </div>
        <div className="h-1 absolute bottom-0 left-0 right-0">
          <div
            className={`bg-neutral-300 h-full w-full -translate-x-full transition-none group-hover:translate-x-0  group-hover:transition-all`}
            style={style}
          ></div>
        </div>
      </div>
    );
  }
);

Thumbnail.displayName = "Thumbnail";

export default Thumbnail;
