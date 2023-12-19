"use client";
import React, { useMemo, useState, useTransition } from "react";
import ReactPlayer from "react-player/youtube";
import { useCookies } from "react-cookie";
import {
  MinusIcon,
  PlusIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";
import IconButton from "../IconButton";
import Image from "../ImageWithTmdbUrl";
import { m } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Similar from "./Similar";
import Meta from "./Meta";
import Genres from "./Genres";
import Episodeguide from "./Episodeguide";
import { ModalState } from "../../app/ModalProvider";
import { Cast, Movie, MovieDetails, Show, ShowDetails } from "../../tmdb/types";
import { getMediaType } from "../../tmdb/requests";
import CastDisplay from "./Cast";
import { useMutation } from "@tanstack/react-query";
import { MutationPayload } from "../../app/[lang]/my-list/api/route";

interface Props {
  videoUrl?: string;
  imageUrl: string;
  title: string;
  cast: Cast[];
  details: MovieDetails | ShowDetails;
  similar?: (Movie | Show)[];
  state: ModalState;
  onClose: () => void;
  onSizeSwitch: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onMyListRemove?: () => void;
}

interface MyListItem {
  id: number;
  type: "movie" | "tv";
}
// eslint-disable-next-line react/display-name
const MovieInfoModal = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      videoUrl,
      imageUrl,
      title,
      details,
      similar,
      state,
      cast,
      onClose,
      onSizeSwitch,
      onMyListRemove,
    }: Props,
    ref
  ) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [audioOn, setAudioOn] = useState<boolean>(false);
    const [myList] = useCookies(["mylist"]);
    const [pending, startTransition] = useTransition();
    const mediaType = getMediaType(details);
    const mutation = useMutation({
      mutationFn: (mutation: MutationPayload) => {
        return fetch("/api/mylist", {
          method: "POST",
          body: JSON.stringify(mutation),
        });
      },
      onSuccess: () => {
        if (onMyListRemove) {
          onMyListRemove();
        }
      },
    });
    const handleAudioClick = () => {
      setAudioOn((state) => !state);
    };
    const variants = {
      hidden: { opacity: 0 },
      small: { opacity: 1 },
      big: { opacity: 1 },
      visible: { opacity: 1 },
    };

    const addToList = async () => {
      startTransition(() => {
        mutation.mutate({ id: details.id, type: mediaType, operation: "add" });
      });
    };
    const removeFromList = async () => {
      startTransition(() => {
        mutation.mutate({ id: details.id, operation: "remove" });
      });
    };

    const isInMyList = useMemo(() => {
      if (!myList.mylist) return false;
      return !(myList.mylist as MyListItem[]).every(
        (item) => item.id !== details.id
      );
    }, [myList]);

    return (
      <>
        <div className="w-full aspect-video relative bg-neutral-900">
          {videoUrl ? (
            <m.div
              className="inset-0 absolute"
              initial={{ opacity: 0 }}
              animate={{ opacity: isPlaying ? 1 : 0 }}
              exit={{ opacity: 0 }}
            >
              <ReactPlayer
                key={videoUrl}
                playing={true}
                className="inset-0 absolute"
                onStart={() => {
                  setIsPlaying(true);
                }}
                onEnded={() => {
                  setIsPlaying(false);
                }}
                url={`https://www.youtube.com/watch?v=${videoUrl}`}
                title={title}
                width={"100%"}
                height={"100%"}
                muted={!audioOn}
                config={{
                  playerVars: { autoplay: 1, controls: 0, mute: 1 },
                }}
              ></ReactPlayer>
            </m.div>
          ) : null}
          <m.div
            className="inset-0 absolute z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            animate={{ opacity: isPlaying ? 0 : 1 }}
          >
            <Image
              className={`object-cover static`}
              src={imageUrl}
              alt={title}
              fill
              sizes="300px"
            />
            <Image
              className={`object-cover static`}
              src={imageUrl}
              alt={title}
              fill
              sizes="600px"
            />
          </m.div>

          {state === "big" && (
            <>
              <div className="absolute w-full bottom-0 h-1/3 z-20 bg-gradient-to-t	from-neutral-800 "></div>
              <div
                className={`absolute bottom-5 w-2/5 left-5 z-20 hover:opacity-100 text-neutral-50`}
              >
                <div className={`w-48 relative`}>
                  <Image
                    className={`w-24 h-auto`}
                    src={details.poster_path}
                    alt={title}
                    width={450}
                    height={675}
                    sizes="200px"
                  />
                </div>
              </div>
            </>
          )}
          {videoUrl && (
            <div className="absolute bottom-5 right-5 z-20 opacity-40 hover:opacity-100">
              <IconButton
                variant="secondary"
                size="small"
                onClick={handleAudioClick}
              >
                {audioOn ? <SpeakerWaveIcon /> : <SpeakerXMarkIcon />}
              </IconButton>
            </div>
          )}
          {onClose && state === "big" && (
            <div className="top-0 right-0 m-1 absolute z-10">
              <IconButton
                size="small"
                variant="secondary"
                onClick={(event) => onClose()}
              >
                <XMarkIcon />
              </IconButton>
            </div>
          )}
        </div>

        <m.div
          variants={variants}
          className={` bg-neutral-800 ${
            state === "big" ? "p-12 pt-4" : "p-4 pt-1"
          } text-neutral-200 text-base`}
        >
          <div className="flex mb-2 items-center gap-2">
            <IconButton variant="alert" size="big">
              <PlayIcon />
            </IconButton>
            {isInMyList ? (
              <IconButton variant="secondary" onClick={removeFromList}>
                <MinusIcon />
              </IconButton>
            ) : (
              <IconButton variant="secondary" onClick={addToList}>
                <PlusIcon />
              </IconButton>
            )}
            <h2 className="text-2xl text-center flex-grow">
              {" "}
              {state === "big" && title}
            </h2>
            <IconButton variant="secondary">
              <HandThumbDownIcon />
            </IconButton>
            {state === "small" && (
              <IconButton variant="secondary" onClick={onSizeSwitch}>
                <ArrowsPointingOutIcon />
              </IconButton>
            )}
            <IconButton variant="secondary">
              <HandThumbUpIcon />
            </IconButton>
          </div>
          {state === "big" ? (
            <div className="grid grid-cols-3 gap-5">
              <div className="col-span-2">
                <Meta info={details} />
                <div className="">
                  <p>{details.overview}</p>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex flex-col">
                  <CastDisplay cast={cast} />
                  <Genres genres={details.genres} />
                </div>
              </div>
            </div>
          ) : (
            <div className="">
              <Meta info={details} />
              <Genres genres={details.genres} />
            </div>
          )}
          {state === "big" && !("release_date" in details) && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ display: "none" }}
            >
              <Episodeguide showId={details.id} seasons={details.seasons} />
            </m.div>
          )}
          {state === "big" && similar && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ display: "none" }}
            >
              <Similar similarTitles={similar} />
            </m.div>
          )}
        </m.div>
      </>
    );
  }
);

export default MovieInfoModal;
