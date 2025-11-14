import { CreateProfileDialog } from "@/components/profile/create-profile-dialog";
import { Profiles } from "@/components/profile/profiles";

import { getAllProfilesOfUser } from "@/lib/dal/profile";

export const revalidate = 600;

export default async function ProfilesPage() {
  const profiles = await getAllProfilesOfUser();

  return (
    <div className="">
      <h1 className="text-2xl mb-4">Profile Settings</h1>
      <div>
        Select the profile you want to change settings for or create a new
        profile.
      </div>
      <Profiles profiles={profiles} />
      <div className="mt-4">
        <CreateProfileDialog />
      </div>
    </div>
  );
}
