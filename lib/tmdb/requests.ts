import { Locale } from "@/i18n-config";
import { api } from "./config";
import {
  Credits,
  EpisodeImages,
  List,
  Movie,
  MovieDetails,
  Person,
  PersonCombinedCredits,
  PersonDetails,
  Season,
  SeasonDetails,
  Show,
  ShowDetails,
  Videos,
} from "./types";

export const getMediaType = (
  media: Show | Movie | MovieDetails | ShowDetails
) => {
  return "release_date" in media ? "movie" : "tv";
};

export const isPerson = (
  media: Movie | Person | Show | MovieDetails | ShowDetails
): media is Person => "gender" in media;

export const isShowOrMovie = (
  media: Movie | Person | Show
): media is Movie | Show =>
  "release_date" in media || "first_air_date" in media;

export const isShow = (
  media: Movie | Person | Show | MovieDetails | ShowDetails
): media is Show => "release_date" in media;

export const isMovie = (
  media: Movie | Person | Show | MovieDetails | ShowDetails
): media is Movie => "first_air_date" in media;

export const getMediaTitle = <
  T extends Show | Movie | MovieDetails | ShowDetails
>(
  media: T
) => {
  return "title" in media ? media.title : media.name;
};

export const getConfig = () => api({ path: "configuration" });

export const getVideos = (id: number) =>
  api<Videos>({
    path: `movie/${id}/videos`,
  });

export type MediaType = "tv" | "movie";

export type MediaList<T extends MediaType> = T extends "tv"
  ? List<Show>
  : List<Movie>;

export type Details<T extends MediaType> = T extends "movie"
  ? MovieDetails
  : ShowDetails;

export type Data<T extends MediaType> = Details<T> & {
  videos: Videos;
  credits: Credits;
  type: T;
};

export const getPopular = <T extends MediaType>(type: T, lang?: Locale) =>
  api<MediaList<T>>({
    path: `${type}/popular`,
    queryParams: [`language=${lang}`],
  });

export const getSimilar = <T extends MediaType>(
  id: number,
  type: T,
  lang?: Locale
) =>
  api<MediaList<T>>({
    path: `${type}/${id}/similar`,
    queryParams: [`language=${lang}`],
  });
export const getRecommendations = <T extends MediaType>(id: number, type: T) =>
  api<MediaList<T>>({
    path: `${type}/${id}/recommendations`,
  });

export const getByGenre = <T extends MediaType>(
  genre: string,
  type: T,
  lang?: Locale
) =>
  api<MediaList<T>>({
    path: `discover/${type}`,
    queryParams: [`with_genres=${genre}`, `language=${lang}`],
  });

export const getNowPlaying = (lang?: Locale) =>
  api<List<Movie>>({
    path: "movie/now_playing",
    queryParams: [`language=${lang}`],
  });

export const getLatest = <T extends MediaType>(type: T) =>
  api<MediaList<T>>({ path: `${type}/latest` });

const getDetails = <T extends MediaType>(
  id: number,
  type: T,
  appendQueries?: string[],
  lang?: Locale
) =>
  api<Data<T>>({
    path: `${type}/${id}`,
    queryParams: appendQueries
      ? [
          `append_to_response=${appendQueries.join()}`,
          `include_video_language=en,${lang}`,
          `language=${lang}`,
        ]
      : [`include_video_language=en,${lang}`, `language=${lang}`],
  });
export const getModalInfos = async <T extends MediaType>(
  id: number,
  type: T,
  lang?: "en" | "de"
): Promise<Data<T>> => {
  const result = await getDetails<T>(id, type, ["videos", "credits"], lang);
  return { ...result, type };
};

export const getEpisodeImages = (
  id: number,
  showId: number,
  seasonId: number
) =>
  api<EpisodeImages>({
    path: `tv/${showId}/season/${seasonId}/episode/${id}/images`,
  });

export const getSeason = async (
  showId: number,
  seasonId: number,
  lang?: Locale
) =>
  api<SeasonDetails>({
    path: `tv/${showId}/season/${seasonId}`,
    queryParams: [`language=${lang}`],
  });

export const searchMedia = async (
  keyword: string,
  pageParam?: number,
  lang?: Locale
) =>
  api<List<Movie | Show | Person>>({
    path: `search/multi`,
    queryParams: [
      `query=${keyword}`,
      `page=${pageParam || 1}`,
      `language=${lang}`,
    ],
  });
export const searchPeople = async (
  keyword: string,
  pageParam?: number,
  lang?: Locale
) =>
  api<List<Person>>({
    path: `search/person`,
    queryParams: [
      `query=${keyword}`,
      `page=${pageParam || 1}`,
      `language=${lang}`,
    ],
  });

export const getActorCredits = async (personId: string) =>
  api<PersonCombinedCredits>({
    path: `person/${personId}/combined_credits`,
  });

export const getActorDetails = async (personId: string) =>
  api<PersonDetails & { combined_credits: Omit<PersonCombinedCredits, "id"> }>({
    path: `person/${personId}`,
    queryParams: [`append_to_response=combined_credits`],
  });
