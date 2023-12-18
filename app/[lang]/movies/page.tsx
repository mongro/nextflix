import React, { Suspense } from "react";
import { getByGenre, getNowPlaying, getPopular } from "../../../tmdb/requests";
import Collection from "../../../components/Collection/Collection";
import Promoted from "../../Promoted";
import { getDictionary } from "../../dictionaries/getDictionary";
import { MovieGenreKey } from "../../dictionaries/type";
import CarouselSkeleton from "../../../components/Collection/CollectionSkeleton";
import { Locale } from "../../../i18n-config";

export default async function Page({
  params,
}: {
  params: { lang: Locale };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const dictionary = await getDictionary(params.lang);

  const promoted = await getNowPlaying(params.lang);

  const popular = getPopular("movie", params.lang);

  const { genres } = dictionary;

  const genreList: MovieGenreKey[] = [
    "27",
    "28",
    "12",
    "14",
    "878",
    "16",
    "80",
    "35",
  ];

  return (
    <div>
      <Promoted promise={promoted} dictionary={dictionary.buttons} />

      <Suspense fallback={<CarouselSkeleton />}>
        <Collection
          collection={popular}
          title={dictionary.header.popularMovies}
        />
      </Suspense>

      {genreList.map((genre) => (
        <Suspense fallback={<CarouselSkeleton />} key={genre}>
          <Collection
            collection={getByGenre(genre, "movie")}
            title={genres[genre]}
          />
        </Suspense>
      ))}
    </div>
  );
}
