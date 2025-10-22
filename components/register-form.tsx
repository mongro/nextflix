import { signUp } from "@/lib/actions";
import { SignUpFormData, signUpFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./Input";
import Button from "./Button";

export function SignUpForm() {
  const [actionState, submitAction, isPending] = useActionState(signUp, {});
  const [, startTransition] = useTransition();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
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
              <FieldDescription>
                Provide a concise title for your bug report.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}
