import { canChangeProfile, verifiyServerSession } from "../auth/authorization";
import { db } from "../db";

export type MutationResponseWithoutData =
  | {
      error: null;
      success: true;
    }
  | { error: { message: string }; success: false };

export async function verifyProfileAccess(profileId: number) {
  const [session, profile] = await Promise.all([
    verifiyServerSession(),
    db.getUserProfile(profileId),
  ]);

  if (!profile) {
    throw new Error("Profile doesnt exist");
  }
  if (!canChangeProfile(session.user, profile)) {
    throw new Error("Unauthorized");
  }

  return { session, profile };
}
export async function verifyIsUser(userId: string) {
  const { user, session } = await verifiyServerSession();

  if (user.id !== userId) {
    throw new Error("User not authorized");
  }

  return { session };
}
