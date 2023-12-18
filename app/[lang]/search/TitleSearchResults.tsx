"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useQueryState } from "next-usequerystate";
import Link from "next/link";
import React from "react";
import Button from "../../../components/Button";
import Thumbnail from "../../../components/Collection/Thumbnail";
import { Locale } from "../../../i18n-config";
import {
  isPerson,
  isShow,
  isShowOrMovie,
  MediaType,
  searchMedia,
} from "../../../tmdb/requests";
import useDebounce from "../../useDebounce";
import SearchGallery from "./SearchGallery";
import { List, Movie, Person, Show } from "../../../tmdb/types";

interface Props {
  collection: List<Movie | Show | Person>;
  search: string;
}

function TitleSearchResults({ collection, search }: Props) {
  const debouncedSearch = useDebounce(search, 300);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    ["searchMedia", debouncedSearch],
    ({ pageParam = 1 }) => searchMedia(search || "", pageParam),
    {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      initialData: { pages: [collection], pageParams: [1] },
      enabled: !!search,
      getNextPageParam: (lastPage, pages) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    }
  );
  const moviesOrShows = data?.pages.reduce<(Movie | Show)[]>((prev, curr) => {
    const result = curr.results;
    const moviesOrShows = result.filter(isShowOrMovie);

    return [...prev, ...moviesOrShows];
  }, []);

  return (
    <div>
      <div className="mt-2">
        {data &&
          data.pages.map((page) => (
            <div className="mb-4" key={page.page}>
              <div className="text-2xl text-neutral-50 mb-2">
                Search for movies/shows with specific actor:{" "}
              </div>
              <ul className="flex flex-wrap  text-xl ">
                {page.results.map(
                  (media) =>
                    isPerson(media) && (
                      <li className="px-2  text-neutral-50" key={media.id}>
                        <Link href={`search?person=${media.id}`}>
                          {media.name}
                        </Link>
                      </li>
                    )
                )}
              </ul>
            </div>
          ))}
      </div>
      {moviesOrShows && <SearchGallery collection={moviesOrShows} />}
      {hasNextPage && (
        <div className="mt-8">
          <Button onClick={(e) => fetchNextPage()}>More Results</Button>
        </div>
      )}
    </div>
  );
}

export default TitleSearchResults;
