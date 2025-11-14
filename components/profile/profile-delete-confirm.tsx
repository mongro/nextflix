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

export function ProfileDeleteConfirm({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog>
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
          <Button onClick={onConfirm} variant="destructive">
            Delete Profile
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
