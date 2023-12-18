import { Crew, Genre, SpokenLanguage } from ".";

interface EpisodeImage {
  file_path: string;
  height: number;
  width: number;
  aspect_ratio: number;
}

export interface EpisodeImages {
  id: number;
  stills: EpisodeImage[];
}

export interface Episode {
  air_date: string;
  episode_number: number;
  crew: Crew[];
  id: number;
  name: string;
  overview: string;
  production_code: string;
  season_number: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  show_id: number;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface SeasonDetails {
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
}

export interface Show {
  id: number;
  name: string;
  first_air_date: string;
  backdrop_path: string;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string;
  popularity: number;
  vote_count: number;
  vote_average: number;
}

export interface ShowWithMediaType extends Show {
  media_type: "tv";
}

export interface ShowDetails {
  backdrop_path: string;
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}
