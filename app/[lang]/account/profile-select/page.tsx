import { ProfileSelect } from "@/components/profile/profile-select";
import { getAllProfilesOfUser } from "@/lib/dal/profile";

export default async function Page() {
  const profiles = await getAllProfilesOfUser();
  return (
    <div className="">
      <ProfileSelect profiles={profiles} />
    </div>
  );
}
