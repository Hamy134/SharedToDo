"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/hooks/use-settings";
import { Settings } from "lucide-react";

export const SettingsModal = () => {
  const { isOpen, onClose } = useSettings();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-xl font-medium flex text-primary items-center">
            <Settings className="h-6 w-6 mr-2" />
            My Settings
          </h2>
        </DialogHeader>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label className="text-md">Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how{" "}
              <span className="text-primary font-semibold">CountWave</span>{" "}
              looks on your device.
            </span>
          </div>

          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
};
