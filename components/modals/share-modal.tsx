"use client";

import { Check, Copy, Globe, LinkIcon, RefreshCw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useShare } from "@/hooks/use-share";
import { cn } from "@/lib/utils";
import { useAction } from "@/hooks/use-action";
import { updateWorkspace } from "@/actions/update-workspace";
import { toast } from "sonner";

export const ShareModal = () => {
  const { isOpen, onClose, workspace } = useShare();
  const [isCopied, setIsCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(workspace?.isPublic);
  const [publicId, setPublicId] = useState(workspace?.publicId);

  const { execute, isLoading } = useAction(updateWorkspace, {
    onSuccess: () => {
      toast.success(`Workspace updated.`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  if (!workspace) return null;

  const inviteUrl = publicId
    ? `${process.env.NEXT_PUBLIC_APP_BASE_URL}/preview/${publicId}`
    : "";

  const handleChange = () => {
    execute({
      id: workspace.id,
      updateData: { isPublic: !isPublic },
    });

    setIsPublic(!isPublic);
  };

  const generateLink = () => {
    const newPublicId = uuidv4();

    execute({
      id: workspace.id,
      updateData: { isPublic: true, publicId: newPublicId },
    });

    setIsPublic(true);
    setPublicId(newPublicId);
  };

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  useEffect(() => {
    setIsPublic(workspace?.isPublic);
    setPublicId(workspace?.publicId);
  }, [workspace?.isPublic, workspace?.publicId]);

  return (
    <Dialog open={isOpen || isLoading} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold flex justify-center items-center text-primary">
            <Share2 className="h-6 w-6 mr-2" />
            Share your Workspace
          </DialogTitle>

          <DialogDescription className="text-center font-medium text-zinc-500">
            Share your <strong> workspaces </strong> with <strong>friends</strong>{" "}
            or <strong>team members</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 flex">
            <LinkIcon className="h-3 w-3 mr-1" /> Link
          </Label>

          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/30 dark:bg-zinc-300/10 text-black dark:text-white cursor-pointer pointer-events-none"
              tabIndex={-1}
              value={inviteUrl}
              placeholder="Click 'Generate Public URL' below."
              disabled={isLoading || !inviteUrl}
              aria-disabled={isLoading || !inviteUrl}
            />
            <Hint
              side="left"
              sideOffset={12}
              description={isCopied ? "Copied" : "Copy to clipboard"}
            >
              <Button
                disabled={isLoading || isCopied || !inviteUrl}
                aria-disabled={isLoading || isCopied || !inviteUrl}
                onClick={onCopy}
                size="icon"
              >
                {isCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </Hint>
          </div>

          <div className="w-full flex justify-between items-center mt-4">
            <Button
              disabled={isLoading}
              aria-disabled={isLoading}
              onClick={generateLink}
              variant="link"
              size="sm"
              className="group text-sm text-zinc-500 dark:hover:text-zinc-400 hover:text-zinc-600 transition"
            >
              Generate a new link
              <RefreshCw className="w-4 h-4 ml-2 group-hover:rotate-90 text-primary/90 group-hover:text-primary transition" />
            </Button>

            <Label className="flex items-center justify-center">
              <Globe
                className={cn(
                  "h-3 w-3 mr-1",
                  isPublic ? "text-emerald-500" : "text-primary"
                )}
              />
              <p className="text-zinc-400 mr-2">Public</p>
              <Switch
                checked={isPublic}
                onCheckedChange={handleChange}
                disabled={isLoading || !inviteUrl}
                aria-disabled={isLoading || !inviteUrl}
              />
            </Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
