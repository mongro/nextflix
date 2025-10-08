import React, { Suspense } from "react";
import { searchMedia } from "../../../tmdb/requests";
import ActorCredits from "./ActorCredits";
import SearchResults from "./SearchResults";
import { Locale } from "../../../i18n-config";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Page(props: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const queryClient = new QueryClient();

  const actor = searchParams?.person;
  const search = searchParams?.q;
  if (search) {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["searchMedia", search],
      staleTime: 1000 * 60 * 60,
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }) =>
        searchMedia(search, pageParam, params.lang),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="pt-16 lg:pt-32  relative mx-4 lg:mx-8">
        {actor ? (
          <ActorCredits actor={actor} />
        ) : (
          search && <SearchResults search={search} key={search} />
        )}
      </div>
    </HydrationBoundary>
  );
}
