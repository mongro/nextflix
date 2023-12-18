"use client";
import React from "react";
import Button from "../components/Button";
import { PlayIcon } from "@heroicons/react/24/solid";
import { DictionaryButtons } from "./dictionaries/type";
import { useModalContext } from "./ModalProvider";
import { MediaType } from "../tmdb/requests";

interface Props {
  dictionary: DictionaryButtons;
  id: number;
  type: MediaType;
}
export function PromotedButtons({ dictionary, id, type }: Props) {
  const modalContext = useModalContext();
  return (
    <div className="flex mt-4">
      <Button variant="alert" size="big">
        <PlayIcon />
        {dictionary.play}
      </Button>
      <Button
        variant="primary"
        size="big"
        onClick={() => modalContext.openBigModal(`${type}-${id}`)}
      >
        <PlayIcon />
        {dictionary.moreInfo}
      </Button>
    </div>
  );
}

export default PromotedButtons;
