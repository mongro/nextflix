import { notFound } from "next/navigation";

const BASE_URL = "https://api.themoviedb.org/3/";
const API_KEY = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY;

interface ApiOptions {
  path?: string;
  queryParams?: string[];
}
export const api = async <T>({ path, queryParams }: ApiOptions) => {
  try {
    const response = await fetch(
      `${BASE_URL}${path}?api_key=${API_KEY}&${
        queryParams ? queryParams.join("&") : ""
      }`
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
