import React, { Suspense } from "react";
import { getActorDetails, searchMedia } from "../../../tmdb/requests";
import ActorCredits from "./ActorCredits";
import TitleSearchResults from "./TitleSearchResults";
import { Locale } from "../../../i18n-config";

export default async function Page(props: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
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
