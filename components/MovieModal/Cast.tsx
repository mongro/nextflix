import React from "react";
import { Cast as CastType } from "../../tmdb/types";

interface Props {
  cast: CastType[];
}
function Cast({ cast }: Props) {
  return (
    <div className="mb-2 my-2">
      <span className="text-neutral-500">{"Cast: "}</span>
      {cast.slice(0, 4).map((actor, index, array) => (
        <span key={actor.id} className="cursor-pointer">{`${actor.name}${
          index !== array.length - 1 ? ", " : ""
        }`}</span>
      ))}
    </div>
  );
}

export default Cast;
