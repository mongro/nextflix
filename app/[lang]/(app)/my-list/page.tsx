import React, { Suspense } from "react";
import { getModalInfos } from "@/lib/tmdb/requests";
import MyList from "./my-list";
import { getDictionary } from "@/i18n/dictionaries/getDictionary";
import { parseInternalId } from "@/lib/tmdb/util";
import { getMyList } from "@/lib/dal/my-list/queries";

export default async function Page(props: {
  params: Promise<{ lang: "en" | "de" }>;
}) {
  const params = await props.params;

  const myListIds = await getMyList();
  const myListPromises = myListIds.map((item) => {
    const { tmdbId, type } = parseInternalId(item.movieId);
    return getModalInfos(tmdbId, type);
  });

  const myList = await Promise.all(myListPromises);
  const dictionary = await getDictionary(params.lang);
  return (
    <div className="mt-16 relative mx-4 lg:mx-8">
      <h2 className="font-extrabold text-xl lg:text-3xl text-neutral-200">
        {dictionary.header.mylist}
      </h2>
      <MyList myList={myList} />
    </div>
  );
}
