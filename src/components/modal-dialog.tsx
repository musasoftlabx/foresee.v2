// * React
import type { Dispatch, ReactNode, SetStateAction } from "react";

// * SUI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";

// * Utils
import { cn } from "@/lib/utils";

export default function ModalDialog({
  children,
  isNewItemOpen,
  setIsNewItemOpen,
  title,
  caption,
}: {
  children: ReactNode;
  isNewItemOpen: boolean;
  setIsNewItemOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  caption: string;
}) {
  return (
    <Dialog
      open={isNewItemOpen}
      onOpenChange={() => setIsNewItemOpen(!isNewItemOpen)}
    >
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className={cn(
          "*:data-[slot=dialog-close]:bg-sidebar *:data-[slot=dialog-close]:-inset-e-6 *:data-[slot=dialog-close]:-top-6",
          "*:data-[slot=dialog-close]:size-7 *:data-[slot=dialog-close]:rounded-full *:data-[slot=dialog-close]:border *:data-[slot=dialog-close]:shadow-sm *:data-[slot=dialog-close]:hover:animate-[spin_0.5s_linear_0.5] transition-transform",
          "bg-sidebar",
          "sm:max-w-md",
          "px-0",
        )}
      >
        <DialogHeader className="px-5">
          <DialogTitle className="text-primary text-lg font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground -mt-3 ml-0.5">
            {caption}
          </DialogDescription>
        </DialogHeader>
        <style>
          {`
            *::-webkit-scrollbar { width: 8px; height: 8px } 
            *::-webkit-scrollbar-track { background: var(--sidebar) }
            *::-webkit-scrollbar-thumb { cursor: grabbing; background: var(--ring); border-radius: var(--radius-lg) }
            *::-webkit-scrollbar-thumb:hover { background: var(--primary) }
          `}
        </style>
        {children}
      </DialogContent>
    </Dialog>
  );
}
