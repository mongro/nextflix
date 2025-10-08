import "server-only";
import { Dictionary } from "./type";
import { notFound } from "next/navigation";
import { Locale } from "../../i18n-config";

const dictionaries = {
  en: () => import("./en.json").then((module) => module.default),
  de: () => import("./de.json").then((module) => module.default),
};

export const getDictionary = async (locale: "en" | "de") =>
  dictionaries[locale]();

export function assertValidLocale(value: string): asserts value is Locale {
  if (!isValidLocale(value)) notFound();
}
function isValidLocale(value: string): value is Locale {
  return ["en", "de"].includes(value);
}
