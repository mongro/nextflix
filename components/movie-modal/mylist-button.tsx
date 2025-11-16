"use client";

import { useIsInMyList, useToggleMyList } from "@/lib/api/my-list";
import IconButton from "../icon-button";
import { Tooltip } from "../ui/tooltip";
import { useDictionary } from "@/app/[lang]/_components/dictionary-provider";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

interface Props {
  movieId: string;
  profileId: number;
  onRemove?: () => void;
}
export function MyListButton({ movieId, profileId, onRemove }: Props) {
  const isInMyListQuery = useIsInMyList(profileId, movieId);
  const { mutate: toggleMyList } = useToggleMyList(
    !!isInMyListQuery.data,
    (isInMyList) => {
      if (!isInMyList && onRemove) {
        onRemove();
      }
    }
  );
  const { dictionary } = useDictionary();

  if (isInMyListQuery.isPending || isInMyListQuery.isError) return null;

  return (
    <>
      <Tooltip.Root placement="top">
        <Tooltip.Trigger asChild>
          <IconButton
            variant="secondary"
            onClick={() => toggleMyList({ profileId, movieId })}
            aria-label={
              isInMyListQuery.data
                ? dictionary.buttons.myListRemove
                : dictionary.buttons.myListAdd
            }
          >
            {isInMyListQuery.data ? <MinusIcon /> : <PlusIcon />}
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>
          {isInMyListQuery.data
            ? dictionary.buttons.myListRemove
            : dictionary.buttons.myListAdd}
        </Tooltip.Content>
      </Tooltip.Root>
    </>
  );
}
