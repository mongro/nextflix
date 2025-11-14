"use server";

import {
  canChangeProfile,
  verifiyServerSession,
} from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { actionErrorHandler } from "@/lib/error-handler";
import { ProfileMovie } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addToMyList(
  profileId: ProfileMovie["profileId"],
  movieId: ProfileMovie["movieId"]
) {
  try {
    const session = await verifiyServerSession();
    const profile = await db.getUserProfile(profileId);
    if (profile && !canChangeProfile(session.user, profile)) {
      throw new Error("Unauthorized");
    }
    const result = await db.addToMyList(profileId, movieId);

    return {
      data: result,
      success: true,
      message: "Operation completed successfully",
    };
  } catch (error) {
    return actionErrorHandler(error);
  }
}

export async function removeFromMyList(
  profileId: ProfileMovie["profileId"],
  movieId: ProfileMovie["movieId"]
) {
  try {
    const session = await verifiyServerSession();
    const profile = await db.getUserProfile(profileId);
    if (profile && !canChangeProfile(session.user, profile)) {
      throw new Error("Unauthorized");
    }
    const result = await db.removeFromMyList(profileId, movieId);
    revalidatePath("/my-list");
    return {
      data: result,
      success: true,
      message: "Operation completed successfully",
    };
  } catch (error) {
    return actionErrorHandler(error);
  }
}
