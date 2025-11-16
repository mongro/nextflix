"use client";

import {
  DropdownMenu,
  DropdownTrigger,
  MenuContent,
  MenuItem,
  MenuPortal,
} from "../ui/dropdown";
import { Button } from "../ui/button";
import { useSignOut } from "@/lib/auth/auth-client";
import { Locale } from "@/i18n-config";
import { useRouter } from "next/navigation";
import { Profile } from "@/lib/prisma";
import Avatar from "../ui/avatar";
import { useDictionary } from "@/app/[lang]/_components/dictionary-provider";

type AccountDropdownProps = {
  lang: Locale;
  profile: Profile | null | undefined;
};
export default function AccountDropdown({
  lang,
  profile,
}: AccountDropdownProps) {
  const router = useRouter();
  const signout = useSignOut(() => router.push("/"));
  const { dictionary } = useDictionary();

  return (
    <DropdownMenu label="account">
      <DropdownTrigger asChild>
        <Button>
          <Avatar
            alt="profilePicure"
            className="size-8"
            src={profile?.avatar}
            width="512"
            height="512"
          />
        </Button>
      </DropdownTrigger>
      <MenuPortal>
        <MenuContent>
          <MenuItem
            label="profiles information"
            onClick={() => router.push("/account/profiles")}
          >
            {dictionary.buttons.manageProfiles}
          </MenuItem>
          <MenuItem
            label="manage profile"
            onClick={() => router.push("/account/profile-select")}
          >
            {dictionary.buttons.switchProfile}
          </MenuItem>
          <MenuItem
            label="Sign Out"
            onClick={() => {
              signout.mutate();
            }}
          >
            {dictionary.buttons.signOut}
          </MenuItem>
        </MenuContent>
      </MenuPortal>
    </DropdownMenu>
  );
}
