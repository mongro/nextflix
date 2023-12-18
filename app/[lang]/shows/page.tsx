import React, { Suspense } from "react";
import { getByGenre, getNowPlaying, getPopular } from "../../../tmdb/requests";
import Collection from "../../../components/Collection/Collection";
import Promoted from "../../Promoted";
import { getDictionary } from "../../dictionaries/getDictionary";
import { TVGenreKey } from "../../dictionaries/type";
import CarouselSkeleton from "../../../components/Collection/CollectionSkeleton";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: "en" | "de" };
  searchParams: { [key: string]: string | undefined };
}) {
  const lang = params.lang;

  const dictionary = await getDictionary(lang);
  const { genres } = dictionary;

  const genreList: TVGenreKey[] = [
    "10763",
    "10766",
    "99",
    "80",
    "18",
    "16",
    "35",
  ];
  const promoted = await getNowPlaying(lang);
  const popular = getPopular("tv", lang);

  return (
    <div>
      <Promoted promise={promoted} dictionary={dictionary.buttons} />
      <Suspense fallback={<div>Loading...</div>}>
        <Collection
          collection={popular}
          title={dictionary.header.popularShows}
        />
      </Suspense>

      {genreList.map((genre) => (
        <Suspense fallback={<CarouselSkeleton />} key={genre}>
          <Collection
            collection={getByGenre(genre, "tv")}
            title={genres[genre]}
          />
        </Suspense>
      ))}
    </div>
  );
}
