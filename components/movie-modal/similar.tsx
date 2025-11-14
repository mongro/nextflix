import React, { useState, useLayoutEffect, useRef } from "react";
import Image from "../ImageWithTmdbUrl";
import { formatToPercentage, formatToYear } from "../../utils/format";
import IconButton from "../icon-button";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Movie, Show } from "@/lib//tmdb/types";
import { useDictionary } from "@/app/[lang]/_components/dictionary-provider";

interface Props {
  similarTitles: (Show | Movie)[];
}

const MAX_HEIGHT = 1000;
function Similar({ similarTitles }: Props) {
  const { dictionary } = useDictionary();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [height, setHeight] = useState<number>(0);
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (container.current) {
      const height = container.current.getBoundingClientRect().height;
      setHeight(height);
      if (height > MAX_HEIGHT) setIsCollapsed(true);
    }
  }, []);

  const shouldBeCollapsed = height > MAX_HEIGHT;

  return (
    <div>
      <h3 className="my-4 text-2xl font-semibold">
        {dictionary.modal.similar}
      </h3>
      <div
        className={`grid gap-4 grid-cols-2 md:grid-cols-3 ${
          isCollapsed ? "overflow-hidden max-h-[1000px]" : ""
        }`}
        ref={container}
      >
        {similarTitles?.map((opus) => {
          return (
            <div key={opus.id} className="w-full bg-neutral-900 rounded">
              <div className="relative w-full aspect-video">
                <Image
                  className="object-cover"
                  src={opus.backdrop_path || opus.poster_path}
                  alt={"release_date" in opus ? opus.title : opus.name}
                  fill
                  sizes="450px"
                />
              </div>
              <div className="flex items-center justify-start flex-wrap p-4">
                <span className="mr-2 text-green-400 font-semibold">
                  {formatToPercentage(opus.vote_average)}
                </span>
                <span className="mr-2 border border-neutral-400 p-1 ">
                  {formatToYear(
                    "first_air_date" in opus
                      ? opus.first_air_date
                      : opus.release_date
                  )}
                </span>
              </div>
              <p className="px-4 pb-6">{opus.overview}</p>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center">
        {isCollapsed && shouldBeCollapsed ? (
          <IconButton onClick={() => setIsCollapsed(false)}>
            <ChevronDownIcon />
          </IconButton>
        ) : (
          shouldBeCollapsed && (
            <IconButton onClick={() => setIsCollapsed(true)}>
              <ChevronUpIcon />
            </IconButton>
          )
        )}
      </div>
    </div>
  );
}

export default Similar;
