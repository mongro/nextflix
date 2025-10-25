import React from "react";
import Image from "./ImageWithTmdbUrl";
import { DictionaryButtons } from "../i18n/dictionaries/type";
import PromotedButtons from "./PromotedButtons";
import { List, Movie } from "@/lib/tmdb/types";

interface Props {
  promise: List<Movie>;
  dictionary: DictionaryButtons;
}
function Promoted({ promise, dictionary }: Props) {
  const { results } = promise;

  const promotedMovie = results[0];
  return (
    <div className=" w-full pb-[40%] relative">
      <div className="absolute w-full h-[56vw]">
        <div className="inset-0 absolute">
          <Image
            className="object-cover pointer-events-none"
            src={promotedMovie.backdrop_path || promotedMovie.poster_path}
            alt={promotedMovie.title}
            fill
            sizes="1200px"
          />
          <div className="h-[16vw] bottom-0 left-0 right-0 absolute w-full back bg-linear-to-t	from-neutral-800 via-neutral-600"></div>
        </div>
      </div>
      <div className="flex flex-col absolute justify-end bottom-0 w-full text-white md:w-1/2 lg:w-1/3 mx-4 lg:mx-8">
        <h2 className="text-4xl ">{promotedMovie.title}</h2>
        <p className="text-white text-sm sm:text-base lg:text-xl mt-2 hidden sm:block">
          {promotedMovie.overview}
        </p>
        <PromotedButtons
          id={promotedMovie.id}
          type="movie"
          dictionary={dictionary}
        />
      </div>
    </div>
  );
}

export default Promoted;
