import React from "react";
import {
  formatToHours,
  formatToPercentage,
  formatToYear,
} from "../../utils/format";
import { MovieDetails, ShowDetails } from "../../tmdb/types";

interface Props {
  info: ShowDetails | MovieDetails;
}
function Meta({ info }: Props) {
  return (
    <div className="flex items-center justify-start flex-wrap my-2">
      {"number_of_seasons" in info ? (
        <span className="mr-2">
          {info.number_of_seasons > 1
            ? `${info.number_of_seasons} Seasons`
            : `${info.number_of_episodes} Episodes`}
        </span>
      ) : (
        <span className="mr-2">{formatToHours(info.runtime)}</span>
      )}
      <span className="mr-2 text-green-400 font-semibold">
        {formatToPercentage(info.vote_average)}
      </span>
      <span className="mr-2 border border-neutral-400 p-1 ">
        {formatToYear(
          "first_air_date" in info ? info.first_air_date : info.release_date
        )}
      </span>
    </div>
  );
}

export default Meta;
