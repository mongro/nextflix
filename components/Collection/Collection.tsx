import React from "react";
import { Items } from "./Items";
import { List, Movie, Show } from "@/lib/tmdb/types";

interface Props {
  title: string;
  collection: Promise<List<Show>> | Promise<List<Movie>>;
}

async function Collection({ collection, title }: Props) {
  const { results } = await collection;

  return (
    <div className="my-6 relative mx-4 lg:mx-8">
      <h2 className="font-extrabold text-xl lg:text-3xl text-neutral-200">
        {title}
      </h2>
      <Items items={results} collection={title} />
    </div>
  );
}

export default Collection;
