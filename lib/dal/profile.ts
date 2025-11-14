"use server";

import { revalidatePath } from "next/cache";
import { verifiyServerSession } from "../auth/authorization";
import { db } from "../db/index";
import { Profile } from "../prisma";
import { redirect } from "next/navigation";
import { MutationResponseWithoutData, verifyProfileAccess } from "./utils";
import z from "zod";

export async function getProfile(id: number) {
  try {
    const { session, profile } = await verifyProfileAccess(id);
    return { profile, error: null };
  } catch (error) {
    console.log(error);
    return { error: { message: "something went wrong" }, profile: null };
  }
}

export type createProfileState = {
  profile: Profile | null;
  error: { message: string } | null;
};

const updateProfileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  avatar: z.string({
    message: "avatar url must be a string",
  }),
  id: z.coerce.number({ message: "Invalid Profile Id" }),
});

const createProfileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  avatar: z.string({
    message: "avatar url must be a string",
  }),
});

export async function createProfile(
  prevState: createProfileState,
  formData: FormData
): Promise<createProfileState> {
  const form = Object.fromEntries(formData);
  const parsedForm = createProfileFormSchema.safeParse(form);
  console.log("form", form);
  if (!parsedForm.success) {
    return {
      error: { message: z.prettifyError(parsedForm.error) },
      profile: null,
    };
  }

  try {
    const session = await verifiyServerSession();
    const profile = await db.createProfile(
      session.user.id,
      parsedForm.data.name,
      parsedForm.data.avatar
    );

    revalidatePath("/account/profiles");

    return { profile, error: null };
  } catch (error) {
    return { error: { message: "Couldnt create profile." }, profile: null };
  }
}

export async function updateProfile(
  prevState: createProfileState,
  formData: FormData
): Promise<createProfileState> {
  const form = Object.fromEntries(formData);
  const parsedForm = updateProfileFormSchema.safeParse(form);
  console.log("form", form);
  if (!parsedForm.success) {
    return {
      error: { message: z.prettifyError(parsedForm.error) },
      profile: null,
    };
  }

  try {
    const { session } = await verifyProfileAccess(parsedForm.data.id);
    const profile = await db.updateProfile(
      parsedForm.data.id,
      parsedForm.data.name,
      parsedForm.data.avatar
    );

    revalidatePath("/account/profiles");
    return { profile, error: null };
  } catch (error) {
    return { error: { message: "Couldnt update profile." }, profile: null };
  }
}

export async function deleteProfile(id: number) {
  try {
    await verifyProfileAccess(id);
    const profile = await db.deleteProfile(id);
    return profile;
  } catch (error) {
    console.log(error);
  }

  redirect("/account/profiles");
}

export async function selectProfile(
  id: number
): Promise<MutationResponseWithoutData> {
  try {
    const { session, profile } = await verifyProfileAccess(id);
    console.log(session.user.id);
    const result = await db.changeSelectedProfile(session.session.id, id);
    return { success: true, error: null };
  } catch (error) {
    console.log(error);
    return { error: { message: "something went wrong" }, success: false };
  }
}

export async function getAllProfilesOfUser() {
  const session = await verifiyServerSession();
  const result = await db.getAllProfilesOfUser(session.user.id);

  return result;
}
