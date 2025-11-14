"use client";

import {
  ExternalMovie,
  ProfileMovieRating,
  Prisma,
  Profile,
} from "@/lib/prisma";
import { ThumbsButtons } from "./thumb-buttons";
import { getInfiniteRatingsQueryOptions } from "@/lib/db-query";
import {
  dehydrate,
  HydrationBoundary,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

type Props = {
  profile: Profile;
};

export function Ratings({ profile }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(getInfiniteRatingsQueryOptions(profile.id, 10));

  return (
    <>
      <div className="flex items-center gap-8 mb-8 font-bold">
        <Link href={`/account/profiles/${profile.id}`}>
          <ArrowLeftIcon className="size-6" />
        </Link>
        <h1 className="text-2xl">Ratings of {profile.name}</h1>
      </div>
      <ul className="table w-full border-collapse">
        {data?.pages?.map((page) =>
          page.map((rating) => (
            <li
              key={rating.movieId}
              className="table-row border-t-2 last:border-y-2"
            >
              <div className="table-cell p-2">
                {rating.ratedAt.toLocaleDateString()}
              </div>
              <div className="table-cell p-2">{rating.movie.title}</div>
              <div className="table-cell p-2">
                <div className="flex items-center ">
                  <ThumbsButtons rating={rating} />
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
      <div className="pt-4">
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()}>
            {" "}
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </Button>
        )}
      </div>
    </>
  );
}
