"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { createWorkspace } from "@/actions/create-workspace";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/use-action";
import { useCreateWorkspace } from "@/hooks/use-create-workspace";
import { CreateWorkspace } from "@/schema";

export const CreateWorkspaceModal = () => {
  const { isOpen, onClose } = useCreateWorkspace();
  const router = useRouter();

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const { execute, isLoading } = useAction(createWorkspace, {
    onSuccess: (data) => {
      toast.success(`Workspace "${data.name}" created.`);
      router.push(`/dashboard/${data.id}`);

      handleClose();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const form = useForm({
    resolver: zodResolver(CreateWorkspace),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateWorkspace>) => {
    execute(values);
  };

  return (
    <Dialog open={isOpen || isLoading} onOpenChange={handleClose}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold flex justify-center items-center text-primary">
            <LayoutGrid className="h-6 w-6 mr-2" />
            Add Workspace
          </DialogTitle>

          <DialogDescription className="text-center font-medium text-zinc-500">
            Enhance <strong>collaboration</strong> and{" "}
            <strong>manage todo list</strong> more effectively with{" "}
            <strong>multiple workspaces</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            autoCapitalize="off"
            autoComplete="off"
          >
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                      Workspace name
                    </FormLabel>

                    <FormControl>
                      <Input
                        disabled={isLoading}
                        aria-disabled={isLoading}
                        placeholder="Enter workspace name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="px-6 py-4">
              <Button disabled={isLoading} aria-disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
