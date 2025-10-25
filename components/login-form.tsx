import { signIn } from "@/lib/auth/actions";
import { SignInFormData, signInFormSchema } from "@/lib/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./Input";
import { Button } from "./ui/button";
import Link from "next/link";

export function SignInForm() {
  const [actionState, submitAction, isPending] = useActionState(signIn, {});
  const [, startTransition] = useTransition();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  return (
    <div>
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
                {actionState.fieldErrors?.email && (
                  <FieldError
                    errors={[{ message: actionState.fieldErrors?.email[0] }]}
                  />
                )}
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
                <div className="flex justify-between">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    <Link href="/auth/forget">
                      {" "}
                      Don&apos;t remember your password?
                    </Link>
                  </p>
                </div>

                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Your password"
                  autoComplete="off"
                  type="password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Loggin In..." : "Login"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Dont have an Account? <Link href="/auth/register">Sign Up</Link>
          </p>
        </FieldGroup>
      </form>
    </div>
  );
}
