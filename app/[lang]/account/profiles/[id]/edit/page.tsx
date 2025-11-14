import { UpdateProfileForm } from "@/components/profile/update-profile-form";
import { getProfile } from "@/lib/dal/profile";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfileEdit(props: Props) {
  const params = await props.params;
  const id = params.id;

  const { profile, error } = await getProfile(Number(id));

  if (error) return <div>{error.message}</div>;
  if (!profile) return <div>Profile doesnt exist</div>;
  return (
    <div className="">
      <UpdateProfileForm profile={profile} />
    </div>
  );
}
