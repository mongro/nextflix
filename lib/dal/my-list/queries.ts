import {
  getServerSession,
  verifiyServerSession,
} from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import prisma, { ProfileMovie } from "@/lib/prisma";

export async function getMyList() {
  const session = await verifiyServerSession();
  const selectedProfileId = session.session.selectedProfileId;

  if (!selectedProfileId) return [];
  const result = await prisma.profileMovie.findMany({
    where: {
      profileId: selectedProfileId,
    },
  });
  return result;
}
export async function isInMyList(
  profileId: ProfileMovie["profileId"],
  movieId: ProfileMovie["movieId"]
) {
  const session = await getServerSession();
  if (!session) return false;
  const result = db.isInMyList(profileId, movieId);
  return result;
}
