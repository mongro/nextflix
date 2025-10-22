import React, { useEffect, useRef, useState, useTransition } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Locale } from "../i18n-config";
import IconButton from "./IconButton";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  onBlur: () => void;
  lang?: Locale;
  lastPage: string;
}
const SearchBar = ({ onBlur, lang, lastPage }: Props) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");

  const pathName = usePathname();
  const searchBarRef = useRef<HTMLInputElement | null>(null);

  const { replace, push } = useRouter();

  useEffect(() => {
    if (searchBarRef.current) {
      searchBarRef.current.focus();
    }
  }, []);

  const resetSearch = () => {
    setSearch("");
    goToLastValidPage();
  };

  const goToLastValidPage = () => {
    push(lastPage);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    updateQuery(value);
  };

  const updateQuery = useDebouncedCallback((value: string) => {
    if (!value) {
      goToLastValidPage();
      return;
    }
    const params = new URLSearchParams(searchParams);
    params.set("q", value);
    params.forEach((_, key) => {
      if (key !== "q") {
        params.delete(key);
      }
    });
    if (!pathName?.includes("/search")) {
      push(`/${lang}/search?${params.toString()}`);
    } else {
      replace(`/${lang}/search?${params.toString()}`);
    }
  }, 400);

  return (
    <div className="flex items-center border-neutral-50 bg-neutral-900 border">
      <MagnifyingGlassIcon className="w-6 h-6 mx-2 text-white" />
      <input
        ref={searchBarRef}
        id="filter-search"
        className="bg-transparent text-white px-4 py-2 outline-hidden animate-width"
        type="text"
        placeholder="Search by Title"
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleSearch(e.target.value);
        }}
        onBlur={(e) => {
          if (!searchParams.get("q")) onBlur();
        }}
      />
      <span className={`${!searchParams.get("q") ? " invisible" : ""}`}>
        <IconButton onClick={resetSearch} size="small" aria-label="Clear">
          <XMarkIcon />
        </IconButton>
      </span>
    </div>
  );
};

export default SearchBar;
