import React from "react";
import Link from "next/link";
import { DictionaryHeader } from "@/i18n/dictionaries/type";
import { Locale } from "@/i18n-config";
import AccountAction from "@/components/navigation/account-action";

function Header({
  dictionary,
  lang,
}: {
  dictionary: DictionaryHeader;
  lang: Locale;
}) {
  return (
    <div className="h-16 w-full top-0 left-0 fixed z-40">
      <div className="mx-auto px-4 lg:w-10/12 p-2 flex items-center h-full justify-between">
        <Link href="/">Back to Main</Link>
        <AccountAction lang={lang} />
      </div>
    </div>
  );
}

export default Header;
