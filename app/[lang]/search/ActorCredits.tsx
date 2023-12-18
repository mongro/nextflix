"use client";
import { PersonCombinedCredits } from "../../../tmdb/types";
import SearchGallery from "./SearchGallery";

interface Props {
  credits: Omit<PersonCombinedCredits, "id">;
  actor: string;
}

function ActorCredits({ credits, actor }: Props) {
  const castCredits = credits.cast;
  return (
    <div>
      <div className="text-3xl text-neutral-50 py-4">
        {`Movies/Shows with ${actor}`}
      </div>
      <SearchGallery collection={castCredits} />
    </div>
  );
}

export default ActorCredits;
