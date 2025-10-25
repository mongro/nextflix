export * from "./movies";
export * from "./person";
export * from "./shows";

export interface List<T> {
  page: number;
  total_results: number;
  total_pages: number;
  results: T[];
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Videos {
  id: number;
  results: Video[];
}
export interface Video {
  size: number;
  name: string;
  iso_639_1: string;
  iso_3166_1: string;
  type: string;
  key: string;
}

export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
  department: string;
  job: string;
}

export interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}
