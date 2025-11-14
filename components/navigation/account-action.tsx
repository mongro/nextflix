import { Locale } from "@/i18n-config";
import AccountDropdown from "./account-dropdown-menu";
import { verifiyServerSession } from "@/lib/auth/authorization";
import { getProfile } from "@/lib/dal/profile";

type AccountActionProps = {
  lang: Locale;
};

export default async function AccountAction({ lang }: AccountActionProps) {
  const session = await verifiyServerSession();
  const selectedProfileId = session.session.selectedProfileId;
  let selectedProfile = null;
  if (selectedProfileId) {
    const { error, profile } = await getProfile(selectedProfileId);
    selectedProfile = profile;
  }

  return <AccountDropdown lang={lang} profile={selectedProfile} />;
}
