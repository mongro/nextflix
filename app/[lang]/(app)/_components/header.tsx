"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DictionaryHeader } from "@/i18n/dictionaries/type";
import LanguageMenu from "@/components/language-dropdown-menu";
import { Locale } from "@/i18n-config";
import SearchBar from "@/components/searchbar";
import IconButton from "@/components/icon-button";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useSearchParams } from "next/navigation";
import { useLastValidPage } from "@/hooks/useLastValidPage";
import AccountActionClient from "@/components/navigation/account-action-client";

function Header({
  dictionary,
  lang,
}: {
  dictionary: DictionaryHeader;
  lang: Locale;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const searchParams = useSearchParams();
  const lastPage = useLastValidPage("/search");
  const [showSearchBar, setShowSearchBar] = useState(
    Boolean(searchParams.get("q"))
  );
  const handleScroll: EventListener = (event: Event) => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`h-16 w-full top-0 left-0 fixed z-40 ${
        isScrolled ? "bg-black" : "bg-transparent"
      } transition-colors	bg-linear-to-b from-black	`}
    >
      <div className="px-4 lg:px-8 flex items-center h-full">
        <nav className="text-neutral-200">
          <ul className="flex items-center [&>li]:ml-6">
            <li>
              <Link
                className="hover:text-neutral-400"
                href={`/${lang}/movies`}
                prefetch={true}
              >
                {dictionary.movies}
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-neutral-400"
                href={`/${lang}/shows`}
                prefetch={true}
              >
                {dictionary.shows}
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-neutral-400"
                href={`/${lang}/my-list`}
              >
                {dictionary.mylist}
              </Link>
            </li>
            <li>
              <LanguageMenu />
            </li>
          </ul>
        </nav>
        <div className="flex items-center h-full absolute right-4 gap-2">
          {showSearchBar || searchParams.get("q") ? (
            <SearchBar
              lastPage={lastPage}
              lang={lang}
              onBlur={() => {
                setShowSearchBar(false);
              }}
            />
          ) : (
            <IconButton
              aria-label="Search"
              size="small"
              variant="secondary"
              onClick={(event) => {
                setShowSearchBar(true);
              }}
            >
              <MagnifyingGlassIcon />
            </IconButton>
          )}
          <AccountActionClient lang={lang} />
        </div>
      </div>
    </div>
  );
}

export default Header;
