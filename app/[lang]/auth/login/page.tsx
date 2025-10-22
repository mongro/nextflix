"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { email, z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Form";
import Button from "@/components/Button";
import { Input } from "@/components/Input";
import { SignInFormData, signInFormSchema } from "@/lib/schema";
import { useActionState, useTransition } from "react";
import { signIn } from "@/lib/actions";
import InputError from "@/components/InputError";

export default function LoginForm() {
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
    <div className="mt-12">
      <Form {...form}>
        <form
          action={submitAction}
          onSubmit={form.handleSubmit((_, e) => {
            startTransition(() => {
              const formData = new FormData(e?.target);
              submitAction(formData);
            });
          })}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <InputError error={actionState?.fieldErrors?.email} />
                <FormDescription>This is your email.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <InputError error={actionState?.fieldErrors?.password} />
                <FormDescription>This is your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
    </div>
  );
}
