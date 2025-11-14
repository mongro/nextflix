import z from "zod";

export const signUpFormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
});
export const signInFormSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;
type SignUpFieldErrors = z.inferFlattenedErrors<
  typeof signUpFormSchema
>["fieldErrors"];

export type SignUpActionState = {
  success: boolean;
  formData?: SignUpFormData;
  fieldErrors?: SignUpFieldErrors;
  error?: { message: string };
};
export type SignInFormData = z.infer<typeof signInFormSchema>;
type SignInFieldErrors = z.inferFlattenedErrors<
  typeof signUpFormSchema
>["fieldErrors"];

export type SignInActionState = {
  success: boolean;
  formData?: SignInFormData;
  fieldErrors?: SignInFieldErrors;
  error?: { message: string };
};
