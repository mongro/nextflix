import React, { Suspense } from "react";
import {
  getByGenre,
  getModalInfos,
  getNowPlaying,
  getPopular,
} from "@/lib/tmdb/requests";
import MyList from "./MyList";
import { cookies } from "next/headers";
import { getDictionary } from "@/i18n/dictionaries/getDictionary";
import { getServerSession } from "@/lib/auth/actions";

interface Item {
  id: number;
  type: "movie" | "tv";
}

export default async function Page(props: {
  params: Promise<{ lang: "en" | "de" }>;
}) {
  const params = await props.params;
  const session = await getServerSession();
  console.log("server", session);
  const cookieStore = await cookies();
  const cookieMyList = cookieStore.get("mylist")?.value;
  let myListIds = (cookieMyList ? JSON.parse(cookieMyList) : []) as Item[];
  const myListPromises = myListIds.map((item) =>
    getModalInfos(item.id, item.type)
  );

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
