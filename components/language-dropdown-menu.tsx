"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n } from "../i18n-config";
import { useDictionary } from "@/app/[lang]/_components/dictionary-provider";
import {
  DropdownMenu,
  DropdownTrigger,
  MenuContent,
  MenuItem,
  MenuPortal,
} from "./ui/dropdown";
import { Button } from "./ui/button";

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
    <DropdownMenu label={lang}>
      <DropdownTrigger asChild>
        <Button variant="outline">{lang}</Button>
      </DropdownTrigger>
      <MenuPortal>
        <MenuContent>
          {i18n.locales.map((locale) => {
            return (
              <MenuItem key={locale} label={locale} asChild>
                <Link
                  className="block px-4 py-2"
                  href={redirectedPathName(locale)}
                >
                  {locale}
                </Link>
              </MenuItem>
            );
          })}
        </MenuContent>
      </MenuPortal>
    </DropdownMenu>
  );
}
