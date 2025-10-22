"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n } from "../i18n-config";
import Dropdown, { MenuItem } from "./Dropdown";
import { useDictionary } from "../app/DictionaryProvider";

export default function LanguageMenu() {
  const { lang } = useDictionary();
  const pathName = usePathname();
  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/";

    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <Dropdown label={lang}>
      {i18n.locales.map((locale) => {
        return (
          <MenuItem
            key={locale}
            className=" text-white cursor-pointer hover:bg-neutral-400 focus:bg-neutral-400 focus:outline-hidden"
          >
            <Link className="block px-4 py-2" href={redirectedPathName(locale)}>
              {locale}
            </Link>
          </MenuItem>
        );
      })}
    </Dropdown>
  );
}
