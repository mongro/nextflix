"use client";

import HandThumbUpIcon from "@heroicons/react/24/solid/HandThumbUpIcon";
import IconButton from "../icon-button";
import HandThumbDownIcon from "@heroicons/react/24/solid/HandThumbDownIcon";
import HandThumbDownIconOutline from "@heroicons/react/24/outline/HandThumbDownIcon";
import HandThumbUpIconOutline from "@heroicons/react/24/outline/HandThumbUpIcon";
import { useGiveRating, useRating, useRemoveRating } from "@/lib/db-query";
import { Tooltip } from "../ui/tooltip";
import { useDictionary } from "@/app/[lang]/_components/dictionary-provider";

type Props = {
  movieId: string;
  profileId: number;
};
export function MovieRatingButtons({ movieId, profileId }: Props) {
  const { data, isPending } = useRating(profileId, movieId);
  const { mutate: giveRating } = useGiveRating();
  const { mutate: removeRating } = useRemoveRating();
  const { dictionary } = useDictionary();

  if (isPending) return null;

  const handleThumbUpClick = () => {
    if (data?.rating === "UP") {
      removeRating({ movieId, profileId });
    } else {
      giveRating({ profileId, movieId, rating: "UP" });
    }
  };
  const handleThumbDownClick = () => {
    if (data?.rating === "DOWN") {
      removeRating({ movieId, profileId });
    } else {
      giveRating({ profileId, movieId, rating: "DOWN" });
    }
  };
  return (
    <>
      <Tooltip.Root placement="top">
        <Tooltip.Trigger asChild>
          <IconButton variant={"secondary"} onClick={handleThumbUpClick}>
            {data?.rating === "UP" ? (
              <HandThumbUpIcon />
            ) : (
              <HandThumbUpIconOutline />
            )}
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>{dictionary.buttons.thumbsUp}</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root placement="top">
        <Tooltip.Trigger asChild>
          <IconButton variant={"secondary"} onClick={handleThumbDownClick}>
            {data?.rating === "DOWN" ? (
              <HandThumbDownIcon />
            ) : (
              <HandThumbDownIconOutline />
            )}
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>{dictionary.buttons.thumbsDown}</Tooltip.Content>
      </Tooltip.Root>
    </>
  );
}
