import "server-only";
import { Dictionary } from "./type";

const dictionaries = {
  en: () => import("./en.json").then((module) => module.default),
  de: () => import("./de.json").then((module) => module.default),
};

export const getDictionary = async (locale: "en" | "de") =>
  dictionaries[locale]?.() ?? dictionaries.en();
