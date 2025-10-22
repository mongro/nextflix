"use client";
import React from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

import { DictionaryButtons } from "./dictionaries/type";
import { useModalContext } from "./ModalProvider";
import { MediaType } from "../tmdb/requests";
import { Button } from "@/components/ui/button";

interface Props {
  dictionary: DictionaryButtons;
  id: number;
  type: MediaType;
}
export function PromotedButtons({ dictionary, id, type }: Props) {
  const modalContext = useModalContext();
  return (
    <div className="flex mt-4 gap-2">
      <Button variant="secondary" size="lg">
        <PlayIcon className="size-6" />
        {dictionary.play}
      </Button>
      <Button
        size="lg"
        onClick={() => modalContext.setBigModalQueryParam(`${type}-${id}`)}
      >
        <InformationCircleIcon className="size-6" />
        {dictionary.moreInfo}
      </Button>
    </div>
  );
}

export default PromotedButtons;
