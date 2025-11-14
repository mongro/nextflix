import prisma from "../prisma";

export async function getAllProfilesOfUser(userId: string) {
  const result = await prisma.profile.findMany({
    where: { userId: userId },
  });

  return result;
}

export async function updateProfile(
  profileId: number,
  name: string,
  avatar?: string
) {
  const profile = await prisma.profile.update({
    where: {
      id: profileId,
    },
    data: { name, avatar },
  });

  return profile;
}
export async function createProfile(
  userId: string,
  name: string,
  avatar: string
) {
  const profile = await prisma.profile.create({
    data: { name, userId, avatar },
  });

  return profile;
}

export async function deleteProfile(id: number) {
  const profile = await prisma.profile.delete({
    where: {
      id: id,
    },
  });

  return profile;
}

export async function getUserProfile(id: number) {
  console.log("get");
  const result = await prisma.profile.findUnique({
    where: { id },
  });

  return result;
}

export async function changeSelectedProfile(sessionId: string, id: number) {
  await prisma.session.update({
    where: { id: sessionId },
    data: { selectedProfileId: id },
  });
}
