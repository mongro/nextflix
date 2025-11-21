import { signUp } from "@/lib/auth/actions";
import { SignUpFormData, signUpFormSchema } from "@/lib/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function SignUpForm() {
  const [actionState, submitAction, isPending] = useActionState(signUp, {
    success: false,
  });
  const [, startTransition] = useTransition();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      password: "",
      email: "",
    },
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (actionState.success) {
      queryClient.refetchQueries({ queryKey: ["session"] });
      router.push("/");
    }
  }, [actionState.success, router, queryClient]);

  return (
    <div>
      <h1 className="text-2xl mb-4">Sign Up</h1>
      <form
        action={submitAction}
        onSubmit={form.handleSubmit((_, e) => {
          startTransition(() => {
            const formData = new FormData(e?.target);
            submitAction(formData);
          });
        })}
      >
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Your email address"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Your strong password"
                  autoComplete="off"
                />
                <FieldDescription>
                  Password must be at least 8 characters long.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Your username"
                  autoComplete="off"
                />
                <FieldDescription>
                  Choose a unique username for your account.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Registering..." : "Register"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an Account?{" "}
            <Link href="/auth/login" className="underline">
              Sign In
            </Link>
          </p>
        </FieldGroup>
      </form>
    </div>
  );
}
