"use client";

import React, { createContext, useContext } from "react";
import { Locale } from "../i18n-config";
import { Dictionary } from "./dictionaries/type";
interface Props {
  children: React.ReactNode;
  dictionary: Dictionary;
  lang: Locale;
}
export interface DictionaryContextType {
  lang: Locale;
  dictionary: Dictionary;
}
const DictionaryContext = createContext<DictionaryContextType | null>(null);

export function useDictionary() {
  let context = useContext(DictionaryContext);
  if (context === null) {
    throw Error("Used Context outside Provider");
  }

  return context;
}

function DictionaryProvider({ children, dictionary, lang }: Props) {
  return (
    <DictionaryContext.Provider value={{ dictionary, lang }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export default DictionaryProvider;
