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
import { SignUpFormData, signUpFormSchema } from "@/lib/schema";
import { useActionState, useTransition } from "react";
import { signUp } from "@/lib/actions";
import InputError from "@/components/InputError";
import { SignUpForm } from "@/components/register-form";

export default function SignUpPage() {
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
    <div className="mt-12">
      <SignUpForm />
      {/*  <Form {...form}>
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <InputError error={actionState?.fieldErrors?.email} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <InputError error={actionState?.fieldErrors?.password} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <InputError error={actionState?.fieldErrors?.name} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form> */}
    </div>
  );
}
