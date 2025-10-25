"use client";

import React, { useState, useEffect } from "react";
import { getSeason, getEpisodeImages } from "@/lib/tmdb/requests";
import { useQuery, useQueries } from "@tanstack/react-query";
import Image from "../ImageWithTmdbUrl";
import IconButton from "../IconButton";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Season } from "@/lib/tmdb/types";
import { useDictionary } from "@/app/[lang]/_components/dictionary-provider";
import {
  DropdownMenu,
  DropdownTrigger,
  MenuContent,
  MenuItem,
  MenuPortal,
} from "../ui/dropdown";
import { Button } from "../ui/button";

const Placeholder = () => (
  <div className="flex flex-col ">
    {Array(10)
      .fill(null)
      .map((_, idx) => (
        <div key={idx} className="h-32 bg-neutral-400 rounded m-2"></div>
      ))}
  </div>
);
interface Props {
  showId: number;
  seasons: Season[];
}

const getFirstSeasonIndex = (seasons: Season[]) => {
  return seasons.findIndex(function (season) {
    return season.season_number === 1;
  });
};

function Episodeguide({ showId, seasons }: Props) {
  const { dictionary, lang } = useDictionary();

  const [seasonIndex, setSeasonIndex] = useState<number>(
    getFirstSeasonIndex(seasons)
  );
  const seasonNumber = seasons[seasonIndex].season_number;
  const episodeCount = seasons[seasonIndex].episode_count;
  const shouldBeCollapsed = episodeCount > 14;

  const [isCollapsed, setIsCollapsed] = useState<boolean>(shouldBeCollapsed);

  const { data: season, isSuccess } = useQuery({
    queryKey: [showId, "season", seasonNumber, lang],
    queryFn: () => getSeason(showId, seasonNumber, lang),
  });

  const episodes = season?.episodes ?? [];
  const userQueries = useQueries({
    queries: episodes?.map((episode) => {
      return {
        queryKey: ["episodeImage", episode.id, lang],
        queryFn: () =>
          getEpisodeImages(episode.episode_number, showId, seasonNumber),
        enabled: !!episodes,
      };
    }),
  });

  const episodesToRender = isCollapsed ? episodes.slice(0, 10) : episodes;

  return (
    <div>
      <div className="flex justify-between items-baseline">
        <h3 className="my-4 text-2xl font-semibold">
          {dictionary.modal.episodes}
        </h3>
        {seasons.length > 1 ? (
          <DropdownMenu label={seasons[seasonIndex].name}>
            <DropdownTrigger>
              <Button variant="outline">{seasons[seasonIndex].name}</Button>
            </DropdownTrigger>
            <MenuPortal>
              <MenuContent>
                {seasons.map((season, index) => (
                  <MenuItem
                    label={season.name}
                    key={season.name + index}
                    onClick={() => setSeasonIndex(index)}
                    className={
                      "px-4 py-1 text-white cursor-pointer hover:bg-neutral-400 focus:bg-neutral-400 focus:outline-hidden"
                    }
                  >
                    <div className="flex items-center">
                      {season.name}
                      <span className="text-sm ml-1">{`(${season.episode_count} Episodes)`}</span>
                    </div>
                  </MenuItem>
                ))}
              </MenuContent>
            </MenuPortal>
          </DropdownMenu>
        ) : (
          seasons[0].name
        )}
      </div>
      {isSuccess ? (
        episodesToRender.map((episode, id) => {
          const { data, isSuccess } = userQueries[id];
          return (
            <div
              className="flex flex-row items-center p-3 border-b border-neutral-400"
              key={episode.id}
            >
              <div className="basis-1/12 text-2xl px-2">{id}</div>
              {isSuccess && data.stills.length > 0 && (
                <div className="basis-3/12">
                  <div className="w-full relative aspect-video rounded overflow-hidden group ">
                    <Image
                      src={data.stills[0].file_path}
                      alt={episode.name}
                      fill
                      sizes="300px"
                    />
                  </div>
                </div>
              )}
              <div className="basis-8/12  text-xl px-4 self-start">
                <div className="font-semibold pb-2">{episode.name}</div>
                <p className="text-sm">{episode.overview}</p>
              </div>
            </div>
          );
        })
      ) : (
        <Placeholder />
      )}

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

export default Episodeguide;
