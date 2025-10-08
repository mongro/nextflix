import { getActorDetails } from "../../../tmdb/requests";
import SearchCollection from "./SearchCollection";

interface Props {
  actor: string;
}

export default async function ActorCredits({ actor }: Props) {
  const actorDetails = await getActorDetails(actor);

  const castCredits = actorDetails.combined_credits.cast;
  return (
    <div>
      <div className="text-3xl text-neutral-50 py-4">
        {`Movies/Shows with ${actorDetails.name}`}
      </div>
      <SearchCollection collection={castCredits} />
    </div>
  );
}
