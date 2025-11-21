"use server";
import { auth, Session } from "@/lib/auth/auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  SignInActionState,
  signInFormSchema,
  SignUpActionState,
  signUpFormSchema,
} from "./schema";
import { APIError } from "better-auth/api";
import { createProfile } from "../db/profile";
import smiley from "@/public/avatars/smiley.png";

export const signIn = async (
  initialState: SignInActionState,
  formData: FormData
): Promise<SignInActionState> => {
  console.log("signIn", formData);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const form = Object.fromEntries(formData);
  const parsedForm = signInFormSchema.safeParse(form);
  if (!parsedForm.success) {
    // If validation fails, return the form data and field errors
    return {
      formData: parsedForm.data,
      fieldErrors: parsedForm.error.flatten().fieldErrors,
      success: false,
    };
  }
  try {
    await auth.api.signInEmail({ body: { email, password } });
    return {
      success: true,
    };
  } catch (error) {
    console.log("error", error);
    if (error instanceof APIError) {
      return {
        formData: parsedForm.data,
        fieldErrors: { email: [error.message] },
        success: false,
        error: { message: error.message },
      };
    }
    return { success: false, error: { message: "Something went wrong" } };
  }
};

export const signUp = async (
  initialState: SignUpActionState,
  formData: FormData
): Promise<SignUpActionState> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const form = Object.fromEntries(formData);
  const parsedForm = signUpFormSchema.safeParse(form);
  if (!parsedForm.success) {
    // If validation fails, return the form data and field errors
    return {
      formData: parsedForm.data,
      fieldErrors: parsedForm.error.flatten().fieldErrors,
      success: false,
    };
  }
  try {
    const res = await auth.api.signUpEmail({ body: { email, password, name } });
    await createProfile(res.user.id, res.user.name, smiley.src);
    return {
      formData: parsedForm.data,
      success: true,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof APIError) {
      return {
        formData: parsedForm.data,
        fieldErrors: { name: [error.message] },
        success: false,
        error: { message: error.message },
      };
    }
    return { success: false, error: { message: "Something went wrong" } };
  }
};

export const signUpAnonym = async () => {
  const name = "User";
  const password = "placeholder";
  const email = crypto.randomUUID() + "@placeholder.com";
  try {
    const res = await auth.api.signUpEmail({ body: { email, password, name } });
    await createProfile(res.user.id, res.user.name, smiley.src);
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof APIError) {
      return {
        success: false,
        error: { message: error.message },
      };
    }
    return { success: false, error: { message: "Something went wrong" } };
  }
};

export const signOut = async () => {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
};
