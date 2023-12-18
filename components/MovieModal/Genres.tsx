import React from "react";

interface Genre {
  name: string;
}
interface Props {
  genres: Genre[];
}
function Genres({ genres }: Props) {
  return (
    <div className="flex flex-wrap text-sm">
      {genres.map((genre) => (
        <span
          key={genre.name}
          className="border-dotted rounded border-white border-2 py-1 px-2 mb-2 first:ml-0 ml-1"
        >
          {genre.name}
        </span>
      ))}
    </div>
  );
}

export default Genres;
