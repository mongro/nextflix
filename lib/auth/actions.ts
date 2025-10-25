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
import { cache } from "react";

export const signIn = async (
  initialState: SignInActionState,
  formData: FormData
) => {
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
    } as SignInActionState;
  }
  console.log("validated", formData);

  try {
    const result = await auth.api.signInEmail({ body: { email, password } });
  } catch (error) {
    console.log("error", error);
    if (error instanceof APIError) {
      return {
        formData: parsedForm.data,
        fieldErrors: { email: [error.message] },
      } as SignInActionState;
    }
  }
  redirect("/");
};

export const signUp = async (
  initialState: SignUpActionState,
  formData: FormData
) => {
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
    } as SignUpActionState;
  }
  try {
    const res = await auth.api.signUpEmail({ body: { email, password, name } });
  } catch (error) {
    if (error instanceof APIError) {
      return {
        formData: parsedForm.data,
        fieldErrors: { name: [error.message] },
      } as SignUpActionState;
    }
  }

  redirect("/");
};

export const signOut = async () => {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
};

export const getServerSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session.userId) {
    redirect("/login");
  }

  return session;
});
