"use client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import Button from "../../../components/Button";
import {
  isPerson,
  isShow,
  isShowOrMovie,
  MediaType,
  searchMedia,
  searchPeople,
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

  const peopleQuery = useQuery({
    queryKey: ["searchPeople", debouncedSearch],
    queryFn: () => searchPeople(search),
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["searchMedia", debouncedSearch],
    queryFn: ({ pageParam = 1 }) => searchMedia(search || "", pageParam),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    initialData: { pages: [collection], pageParams: [1] },
    enabled: !!search,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
  const moviesOrShows = data?.pages.reduce<(Movie | Show)[]>((prev, curr) => {
    const result = curr.results;
    const moviesOrShows = result.filter(isShowOrMovie);

    return [...prev, ...moviesOrShows];
  }, []);

  return (
    <div>
      <div className="mt-2">
        <div className="text-2xl text-neutral-50 mb-2">
          Search for movies/shows with specific actor:{" "}
        </div>
        <div className="mb-4">
          <ul className="flex flex-wrap  text-xl ">
            {peopleQuery.data &&
              peopleQuery.data.results.map((person) => (
                <li className="px-2  text-neutral-50" key={person.id}>
                  <Link href={`search?person=${person.id}`}>{person.name}</Link>
                </li>
              ))}
          </ul>
        </div>
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
