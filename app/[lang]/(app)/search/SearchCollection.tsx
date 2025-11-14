import MovieThumbnail from "@/components/collection/movie-thumbnail";
import { isShowOrMovie } from "@/lib/tmdb/requests";
import { Movie, Show } from "@/lib/tmdb/types";

interface Props {
  collection: Show[] | Movie[];
}
export default function SearchCollection({ collection }: Props) {
  return (
    <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-16">
      {collection.map(
        (media) =>
          isShowOrMovie(media) && (
            <MovieThumbnail key={media.id} media={media} collection="search" />
          )
      )}
    </div>
  );
}
