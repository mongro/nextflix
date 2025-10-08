import React, { Suspense } from "react";

import PeopleSearchDisplay from "./PeopleSearchDisplay";
import MovieSearchDisplay from "./MovieSearchDisplay";

interface Props {
  search: string;
}

function SearchResults({ search }: Props) {
  return (
    <div>
      <Suspense>
        <PeopleSearchDisplay search={search} />
      </Suspense>
      <Suspense>
        <MovieSearchDisplay search={search} />
      </Suspense>
    </div>
  );
}

export default SearchResults;
