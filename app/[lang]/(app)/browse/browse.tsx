import React, { Suspense } from "react";
import { Locale } from "@/i18n-config";
import { getByGenre, getNowPlaying, getPopular } from "@/lib/tmdb/requests";
import Collection from "@/components/collection/collection";
import {
  assertValidLocale,
  getDictionary,
} from "@/i18n/dictionaries/getDictionary";
import Promoted from "@/components/promoted";

export default async function Browse({ lang }: { lang: string }) {
  assertValidLocale(lang);
  const dictionary = await getDictionary(lang);

  const promoted = await getNowPlaying(lang as Locale);
  const popular = getPopular("movie", lang as Locale);
  const horror = getByGenre("27", "movie");
  const action = getByGenre("28", "movie");
  const adventure = getByGenre("12", "movie");
  const fantasy = getByGenre("14", "movie");
  const science = getByGenre("878", "movie");
  const animation = getByGenre("16", "movie");
  const crime = getByGenre("80", "movie");
  const comedy = getByGenre("35", "movie");

  return (
    <div>
      <Promoted promise={promoted} dictionary={dictionary.buttons} />
      <Suspense fallback={<div>Loading...</div>}>
        <Collection collection={popular} title="Popular Movies" />
        <Collection collection={horror} title="Horror Movies" />
        <Collection collection={comedy} title="Comedy Movies" />
        <Collection collection={crime} title="Crime" />
        <Collection collection={action} title="Action" />
        <Collection collection={adventure} title="Adventure" />
        <Collection collection={fantasy} title="Fantasy" />
        <Collection collection={animation} title="Animation" />
        <Collection collection={science} title="Science" />
      </Suspense>
    </div>
  );
}
