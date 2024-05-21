"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteWorkspace } from "@/actions/delete-workspace";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAction } from "@/hooks/use-action";
import { useDeleteWorkspace } from "@/hooks/use-delete-workspace";

export const DeleteWorkspaceModal = () => {
  const router = useRouter();
  const { isOpen, toggle, onClose, workspaceId } = useDeleteWorkspace();

  const { execute, isLoading } = useAction(deleteWorkspace, {
    onSuccess: (data) => {
      toast.success(`Workspace "${data.name} deleted."`);
      router.push(`/dashboard`);

      onClose();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  return (
    <AlertDialog open={isOpen || isLoading} onOpenChange={toggle}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>

          <AlertDialogDescription>
            You won&apos;t be able to <strong>recover this workspace</strong>{" "}
            after this action.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} aria-disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            aria-disabled={isLoading}
            onClick={() => execute({ id: workspaceId })}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
