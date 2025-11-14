"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useDeleteProfile } from "@/lib/db-query";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

export function ProfileDeleteDialog({ profileId }: { profileId: number }) {
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();
  const handleSuccess = () => {
    router.push("/account/profiles");
  };
  const mutation = useDeleteProfile(handleSuccess);
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="lg">
          {" "}
          Delete Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Really delete profile?</DialogTitle>
        <DialogDescription>
          All data will be gone and can never be recoverd.
        </DialogDescription>
        <DialogFooter>
          <Button
            onClick={() => mutation.mutate({ profileId })}
            variant="destructive"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Spinner />}
            {mutation.isPending ? "Deleting..." : "Delete Profile"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
