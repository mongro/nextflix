import { notFound } from "next/navigation";
import { ApiSuccessResponse } from "../response";

interface ApiOptions {
  path?: string;
  queryParams?: Record<string, string | number | boolean | undefined | null>;
}

function buildUrlWithParams(
  url: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  if (!params) return url;
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null
    )
  );
  if (Object.keys(filteredParams).length === 0) return url;
  const queryString = new URLSearchParams(
    filteredParams as Record<string, string>
  ).toString();
  return `${url}?${queryString}`;
}

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

function reviveDate(key: string, value: string) {
  if (typeof value === "string" && dateFormat.test(value)) {
    return new Date(value);
  }

  return value;
}

export const api = async <T extends ApiSuccessResponse<unknown>>({
  path,
  queryParams,
}: ApiOptions) => {
  const fullUrl = buildUrlWithParams(`${path}`, queryParams);

  const response = await fetch(fullUrl);
  if (!response.ok) {
    if (response.status === 404) {
      throw notFound();
    }
    const message = `An error has occured: ${response.url}`;
    throw new Error(message);
  }
  const result = JSON.parse(await response.text(), reviveDate) as T;
  return result.data as T extends ApiSuccessResponse<infer S> ? S : never;
};
