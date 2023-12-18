import React, { useEffect, useRef, useState, useTransition } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Locale } from "../i18n-config";
import IconButton from "./IconButton";
import useDebounce from "../app/useDebounce";

interface Props {
  onBlur: () => void;
  lang?: Locale;
}
const SearchBar = ({ onBlur, lang }: Props) => {
  const [search, setSearch] = useState("");
  const query = useDebounce(search, 400);
  const searchParams = useSearchParams();
  console.log("searchParams", searchParams);
  const [isPending, startTransition] = useTransition();
  const pathName = usePathname();
  const searchBarRef = useRef<HTMLInputElement | null>(null);

  const { replace, back, push } = useRouter();

  useEffect(() => {
    if (search) {
      startSearch(query);
    }
  }, [query]);

  useEffect(() => {
    if (searchBarRef.current) {
      searchBarRef.current.focus();
    }
  }, []);

  function resetSearch() {
    setSearch("");
    if (pathName?.includes("/search")) back();
  }
  function startSearch(search: string) {
    if (!pathName?.includes("/search")) {
      push(`/${lang}/search?q=${search}`);
    } else {
      replace(`/${lang}/search?q=${search}`);
    }
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const inputSearch = event.target.value;
    if (!inputSearch) {
      resetSearch();
    } else {
      setSearch(inputSearch);
    }
  }

  return (
    <div className="flex items-center border-neutral-50 bg-neutral-900 border">
      <MagnifyingGlassIcon className="w-6 h-6 mx-2 text-white" />
      <input
        ref={searchBarRef}
        id="filter-search"
        className="bg-transparent text-white px-4 py-2 outline-none animate-width"
        type="text"
        placeholder="Search by Title"
        value={search || ""}
        onChange={handleSearchChange}
        onBlur={(e) => {
          console.log("searchBlur", search);
          if (!search) onBlur();
        }}
      />
      <span className={`${!search ? " invisible" : ""}`}>
        <IconButton onClick={resetSearch} size="small">
          <XMarkIcon />
        </IconButton>
      </span>
    </div>
  );
};

export default SearchBar;
