"use client";

import React from "react";
import { isShowOrMovie, searchMedia } from "../../../tmdb/requests";
import { Movie, Show } from "../../../tmdb/types";
import MovieThumbnail from "../../../components/Collection/MovieThumbnail";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../../../components/Button";

interface Props {
  search: string;
}

function SearchGallery({ search }: Props) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["searchMedia", search],
    queryFn: ({ pageParam = 1 }) => searchMedia(search || "", pageParam),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    enabled: !!search,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
  console.log(data, "moviesOrShows");

  const queryClient = useQueryClient();
  console.log(queryClient.getQueryData(["searchMedia", search]), "qc");

  const moviesOrShows = data?.pages.reduce<(Movie | Show)[]>((prev, curr) => {
    const result = curr.results;
    const moviesOrShows = result.filter(isShowOrMovie);

    return [...prev, ...moviesOrShows];
  }, []);
  return (
    <>
      <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-16">
        {moviesOrShows &&
          moviesOrShows.map(
            (media) =>
              isShowOrMovie(media) && (
                <MovieThumbnail
                  key={media.id}
                  media={media}
                  collection="search"
                />
              )
          )}
      </div>
      {hasNextPage && (
        <div className="mt-8">
          <Button onClick={(e) => fetchNextPage()}>More Results</Button>
        </div>
      )}
    </>
  );
}

export default SearchGallery;
