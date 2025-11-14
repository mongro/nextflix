import { Profile } from "@/lib/prisma";
import Link from "next/link";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import { ProfileDeleteDialog } from "./profile-delete-dialog";

type ProfileSettingProps = {
  profile: Profile;
};
export function ProfileSettings({ profile }: ProfileSettingProps) {
  return (
    <div>
      <div className="p-4 border-2 rounded mt-4">
        <ul>
          <li className="p-4 hover:bg-accent/50 border-b-2">
            <Link href={`/account/profiles/${profile.id}/edit`}>
              <div className="flex items-center ">
                <div className="text-lg font-bold grow">Edit Profile</div>
                <ChevronRightIcon className="size-6 pl-2" />
              </div>
            </Link>
          </li>
          <li className="p-4 hover:bg-accent/50 border-b-2">
            <Link href={`/account/profiles/${profile.id}/ratings`}>
              <div className="flex items-center ">
                <div className="text-lg font-bold grow">Ratings</div>
                <ChevronRightIcon className="size-6 pl-2" />
              </div>
            </Link>
          </li>
        </ul>
      </div>
      <div className="mt-4">
        <ProfileDeleteDialog profileId={profile.id} />
      </div>
    </div>
  );
}
