export type Dictionary = {
  genres: DictionaryGenres;
  header: DictionaryHeader;
  modal: DictionaryModal;
  buttons: DictionaryButtons;
};

export type DictionaryHeader = {
  movies: string;
  shows: string;
  mylist: string;
  popularShows: string;
  popularMovies: string;
};

export type DictionaryButtons = {
  play: string;
  moreInfo: string;
};

export type DictionaryModal = {
  similar: string;
  episodes: string;
};

export type DictionaryGenres = DictionaryMovieGenres & DictionaryTVGenres;

export type DictionaryMovieGenres = Record<MovieGenreKey, string>;
export type DictionaryTVGenres = Record<TVGenreKey, string>;

export type MovieGenreKey =
  | "28"
  | "12"
  | "16"
  | "35"
  | "80"
  | "99"
  | "18"
  | "10751"
  | "14"
  | "36"
  | "27"
  | "878"
  | "53"
  | "37";

export type TVGenreKey =
  | "16"
  | "35"
  | "80"
  | "99"
  | "18"
  | "9648"
  | "10763"
  | "10764"
  | "10766"
  | "10767"
  | "37";
