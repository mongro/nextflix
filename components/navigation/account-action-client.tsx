import { Locale } from "@/i18n-config";
import Link from "next/link";
import AccountDropdown from "./account-dropdown-menu";
import { useSession } from "@/lib/auth/auth-client";
import { useProfile } from "@/lib/db-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "../ui/spinner";

type AccountActionProps = {
  lang: Locale;
};
/*
  Wrapper around Dropdown where  session gets loaded on the
  client side to keep page static
*/

export default function AccountActionClient({ lang }: AccountActionProps) {
  const session = useSession();
  const router = useRouter();
  const selectedProfileId = session.data?.data?.session.selectedProfileId;
  const profileQuery = useProfile(selectedProfileId);
  useEffect(() => {
    if (session.data?.data?.user && !selectedProfileId) {
      router.push("/account/profile-select");
    }
  }, [selectedProfileId, router, session.data?.data?.user]);

  if (session.isPending || profileQuery.isFetching)
    return <Spinner className="size-8" />;
  return session?.data?.data?.user ? (
    <AccountDropdown lang={lang} profile={profileQuery.data?.profile} />
  ) : (
    <Link href={`/${lang}/auth/login`}>Sign In</Link>
  );
}
