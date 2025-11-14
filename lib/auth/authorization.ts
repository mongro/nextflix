import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth, User } from "./auth";
import { Prisma, Profile } from "../prisma";

export const getServerSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
});

export const verifiyServerSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session.userId) {
    redirect("/auth/login");
  }

  return session;
});

export const canSeeProfile = (user: User, profile: Profile) => {
  return user.id === profile.userId;
};
export const canChangeProfile = (user: User, profile: Profile) => {
  return user.id === profile.userId;
};
