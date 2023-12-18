"use client";

import React, { useMemo } from "react";
import { AnimatePresence, m } from "framer-motion";
import Thumbnail from "../../../components/Collection/Thumbnail";
import { useCookies } from "react-cookie";
import { useModalContext } from "../../ModalProvider";
import { Movie, MovieDetails, Show, ShowDetails } from "../../../tmdb/types";
import { MediaType, getMediaType } from "../../../tmdb/requests";

interface MyListItem {
  id: number;
  type: "movie" | "tv";
}

export default function Page({
  myList,
}: {
  myList: (MovieDetails | ShowDetails)[];
}) {
  const [myListCookie] = useCookies(["mylist"]);

  const { openSmallModal } = useModalContext();

  const onHover = (id: number, type: MediaType, thumbnail: HTMLDivElement) => {
    openSmallModal(id, type, thumbnail, {
      closeOnMyListRemove: true,
    });
  };

  const myListUpdated = useMemo(() => {
    //if (!myListCookie.mylist) return [];
    return myList.filter(
      (item) =>
        !(myListCookie.mylist as MyListItem[]).every(
          (cookie) => item.id !== cookie.id
        )
    );
  }, [myListCookie]);

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      <AnimatePresence>
        {myListUpdated.map((media) => (
          <m.div exit={{ opacity: 0 }} layout="position" key={media.id}>
            <Thumbnail
              media={media}
              key={media.id}
              onHover={(thumbnail) =>
                onHover(media.id, getMediaType(media), thumbnail)
              }
            />
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
