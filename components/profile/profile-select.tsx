"use client";

import { Profile } from "@/lib/generated/prisma";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { selectProfile } from "@/lib/dal/profile";
import Avatar from "../ui/avatar";

type ProfilesProps = {
  profiles: Profile[];
};
export function ProfileSelect({ profiles }: ProfilesProps) {
  const router = useRouter();
  const { data, mutate, isPending } = useMutation({
    mutationFn: selectProfile,

    onSuccess: async (data, variables, onMutateResult, context) => {
      console.log("success", data.success);
      await context.client.refetchQueries({ queryKey: ["session"] });
      router.push("/");
    },
  });
  return (
    <div className="fixed inset-0 ">
      <div className="items-center justify-center flex flex-col inset-0 absolute gap-4">
        <h1 className="text-3xl my-4">Who is watching?</h1>
        <div className="grid grid-cols-5 gap-4  max-w-2xl w-full">
          {profiles.map((profile: Profile) => {
            return (
              <div
                key={profile.id}
                role="button"
                className="text-center group"
                aria-label="selectProfile"
                onClick={() => mutate(profile.id)}
              >
                <div className="aspect-square  border-4 border-transparent group-hover:border-foreground">
                  <Avatar
                    src={profile.avatar}
                    alt="avatar"
                    width={512}
                    height={512}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <span className="text-center text-muted-foreground group-hover:text-foreground">
                  {profile.name}
                </span>
              </div>
            );
          })}
        </div>
        <Button
          variant="link"
          size="lg"
          onClick={() => router.push("/account/profiles")}
        >
          Manage Profiles
        </Button>
      </div>
    </div>
  );
}
