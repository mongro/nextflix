import { MediaType } from "./requests";

export function createInternalId(tmdbId: number, type: MediaType): string {
  return `${type}-${tmdbId}`;
}

export function parseInternalId(internalId: string): {
  tmdbId: number;
  type: MediaType;
} {
  const [type, id] = internalId.split("-");
  return { tmdbId: parseInt(id, 10), type: type as MediaType };
}
