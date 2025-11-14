"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CreateProfileForm } from "./create-profile-form";

export function CreateProfileDialog() {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button size="lg">Add profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-2xl">Add a profile</DialogTitle>
        <CreateProfileForm onSuccess={() => setShowDialog(false)} />
      </DialogContent>
    </Dialog>
  );
}
