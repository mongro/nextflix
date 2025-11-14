import React, { Suspense } from "react";
import { getByGenre, getNowPlaying, getPopular } from "@/lib/tmdb/requests";
import Collection from "@/components/collection/collection";
import Promoted from "@/components/promoted";
import { getDictionary } from "@/i18n/dictionaries/getDictionary";
import { TVGenreKey } from "@/i18n/dictionaries/type";
import CarouselSkeleton from "@/components/collection/collection-skeleton";

export default async function Page(props: {
  params: Promise<{ lang: "en" | "de" }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await props.params;
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
