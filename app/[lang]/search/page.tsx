import React, { Suspense } from "react";
import { getActorDetails, searchMedia } from "../../../tmdb/requests";
import ActorCredits from "./ActorCredits";
import TitleSearchResults from "./TitleSearchResults";
import { Locale } from "../../../i18n-config";

export default async function Page({
  searchParams,
  params,
}: {
  params: { lang: Locale };
  searchParams: { [key: string]: string | undefined };
}) {
  const actor = searchParams?.person;
  const actorDetails = actor ? await getActorDetails(actor) : undefined;
  const collectionSearch =
    searchParams?.q && !actorDetails
      ? await searchMedia(searchParams.q, 1, params.lang)
      : undefined;
  return (
    <div className="pt-16 lg:pt-32  relative mx-4 lg:mx-8">
      {actor && actorDetails ? (
        <ActorCredits
          credits={actorDetails.combined_credits}
          actor={actorDetails.name}
        />
      ) : collectionSearch ? (
        <TitleSearchResults
          collection={collectionSearch}
          search={searchParams.q || ""}
          key={searchParams.q}
        />
      ) : (
        <div>No results</div>
      )}
    </div>
  );
}
