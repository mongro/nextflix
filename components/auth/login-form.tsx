import { signIn } from "@/lib/auth/actions";
import { SignInFormData, signInFormSchema } from "@/lib/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [actionState, submitAction, isPending] = useActionState(signIn, {
    success: false,
  });
  const [, startTransition] = useTransition();
  const router = useRouter();

  const queryClient = useQueryClient();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  useEffect(() => {
    if (actionState.success) {
      queryClient.refetchQueries({ queryKey: ["session"] });
      router.push("/");
    }
  }, [actionState.success, router]);

  const toggleSetShowPassword = () => {
    setShowPassword((value) => !value);
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Sign in</h1>
      <form
        action={submitAction}
        onSubmit={form.handleSubmit((_, e) => {
          e?.preventDefault();
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
                <div className="relative">
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Your password"
                    autoComplete="off"
                    type={showPassword ? "text" : "password"}
                  ></Input>
                  <div className="absolute right-2 top-0 flex items-center justify-center h-full">
                    <Button
                      onClick={toggleSetShowPassword}
                      size="icon-sm"
                      variant="outline"
                      type="button"
                      className=" rounded-full"
                    >
                      {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </Button>
                  </div>
                </div>
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
            Dont have an Account?{" "}
            <Link href="/auth/register" className="underline">
              Sign Up
            </Link>
          </p>
        </FieldGroup>
      </form>
    </div>
  );
}
