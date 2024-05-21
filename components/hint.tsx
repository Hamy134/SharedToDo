import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type HintProps = {
  children: React.ReactNode;
  description: string;
  align?: "center" | "start" | "end" | undefined;
  side?: "left" | "right" | "top" | "bottom";
  sideOffset?: number;
  delayDuration?: number;
};

export const Hint = ({
  children,
  description,
  align,
  side = "bottom",
  sideOffset = 0,
  delayDuration = 0,
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          align={align}
          sideOffset={sideOffset}
          side={side}
          className="text-xs max-w-[220px] break-words"
        >
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
