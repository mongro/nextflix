import { notFound } from "next/navigation";

const BASE_URL = "https://api.themoviedb.org/3/";
const API_KEY = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY;
export const LIFETIME_CACHE_TMDB = 10000;

interface ApiOptions {
  path?: string;
  queryParams?: string[];
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}
export const api = async <T>({
  path,
  queryParams,
  cache = "force-cache",
  next = { revalidate: LIFETIME_CACHE_TMDB },
}: ApiOptions) => {
  try {
    const response = await fetch(
      `${BASE_URL}${path}?api_key=${API_KEY}&${
        queryParams ? queryParams.join("&") : ""
      }`,
      { cache, next }
    );
    if (!response.ok) {
      if (response.status === 404) {
        throw notFound();
      }
      const message = `An error has occured: ${response.url}`;
      throw new Error(message);
    }
    const result = (await response.json()) as T;
    return result;
  } catch (error) {
    throw error;
  }
};
