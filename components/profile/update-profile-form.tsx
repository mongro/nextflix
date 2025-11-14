"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import z from "zod";
import { createProfileState, updateProfile } from "@/lib/dal/profile";
import { AvatarSelect } from "./avatar-select";
import { Profile } from "@/lib/prisma";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/solid";
import Avatar from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import Link from "next/link";

type CreateProfileFormData = {
  name: string;
  avatar: string;
  id: number;
};

const updateProfileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Enter a profile name.",
  }),
  avatar: z.string({
    message: "Select an avatar image.",
  }),
  id: z.number({ message: "Invalid Profile Id" }),
});
export function UpdateProfileForm({ profile }: { profile: Profile }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const formAction = async (
    prevState: createProfileState,
    formData: FormData
  ) => {
    const result = await updateProfile(prevState, formData);
    if (!result.error && profile) {
      queryClient.refetchQueries({ queryKey: ["profile"] });
      console.log("client", window ? "client" : "server");
      router.push(`/account/profiles/${profile.id}`);
    }
    return result;
  };
  const [actionState, submitAction, isPending] = useActionState(formAction, {
    profile: null,
    error: null,
  });
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [, startTransition] = useTransition();
  const form = useForm<CreateProfileFormData>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      name: profile.name,
      id: profile.id,
      avatar: profile.avatar ?? "",
    },
  });

  return (
    <div>
      <div className="flex items-center gap-8 mb-8 font-bold">
        <Link href={`/account/profiles/${profile.id}`}>
          <ArrowLeftIcon className="size-6" />
        </Link>
        <h1 className="text-2xl">Edit profile</h1>
      </div>

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
            name="avatar"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Dialog
                  open={showAvatarSelection}
                  onOpenChange={setShowAvatarSelection}
                >
                  <DialogTrigger className="w-1/2 max-w-64 flex items-center justify-center relative group">
                    <div className="absolute flex items-center justify-center rounded-full size-10 group-hover:bg-background p-2 bg-background/50">
                      <PencilIcon />
                    </div>
                    <Avatar
                      src={field.value}
                      alt="avatar"
                      width={512}
                      height={512}
                    />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Choose your avatar image</DialogTitle>
                    <DialogDescription></DialogDescription>
                    <AvatarSelect
                      onSelect={(avatar: string) => {
                        form.setValue("avatar", avatar);
                        console.log("set avaatr", avatar);
                        setShowAvatarSelection(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Name"
                  autoComplete="off"
                  hidden
                  value={field.value ?? ""}
                  disabled={field.value === null}
                />
              </Field>
            )}
          />
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Name"
                  autoComplete="off"
                />
                {actionState.error && (
                  <FieldError errors={[actionState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="id"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  hidden
                />
              </Field>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? "Saving..." : "Save"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
