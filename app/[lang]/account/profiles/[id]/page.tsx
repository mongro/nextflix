import { ProfileSettings } from "@/components/profile/profile-settings";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/dal/profile";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const id = params.id;
  const { profile, error } = await getProfile(Number(id));

  if (error) return <div>{error.message}</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div>
      <div className="flex items-center gap-8 mb-8 font-bold">
        <Link href="/account/profiles">
          <ArrowLeftIcon className="size-6" />
        </Link>
        <h1 className="text-2xl">{`Settings for ${profile.name}`}</h1>
      </div>
      <ProfileSettings profile={profile} />
    </div>
  );
}
