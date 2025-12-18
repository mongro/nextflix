import { getServerSession } from "@/lib/auth/authorization";
import { Profile } from "@/lib/prisma";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Avatar from "../ui/avatar";

type ProfilesProps = {
  profiles: Profile[];
};
export async function Profiles({ profiles }: ProfilesProps) {
  const session = await getServerSession();

  return (
    <div className="p-4 border-2 rounded mt-4">
      <ul>
        {profiles.map((profile: Profile) => {
          return (
            <li key={profile.name} className="border-b-2">
              <Link
                href={`/account/profiles/${profile.id}`}
                className="p-4 hover:bg-accent/50 block"
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    src={profile.avatar}
                    alt="avatar"
                    className="size-12"
                  />
                  <div className="text-lg font-bold grow">{profile.name}</div>
                  {profile.id === session?.session.selectedProfileId && (
                    <div className="text-sm flex items-center justify-center ">
                      Your Profile
                    </div>
                  )}
                  <ChevronRightIcon className="size-6 pl-2" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
