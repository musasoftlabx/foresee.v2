// * React
import {
  type RefObject,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  Fragment,
  useRef,
} from "react";

// * SUI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";

// * HUI
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
  useDraggable,
} from "@heroui/react";

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
  const dialogRef = useRef(null);

  const { isOpen, onOpenChange } = useDisclosure();
  const targetRef = useRef<RefObject<HTMLElement> | any>(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

  return (
    <>
      <style>
        {`
          div .backdrop-blur-md { filter: blur(var(--blur-xs)) } 
          .backdrop-blur-md { --tw-backdrop-blur: unset }
        `}
      </style>
      <Modal
        ref={targetRef}
        backdrop="blur"
        shadow="lg"
        isOpen={isNewItemOpen}
        onClose={() => setIsNewItemOpen(false)}
        onOpenChange={onOpenChange}
        draggable={false}
        isDismissable={false}
        className={cn("bg-sidebar", "overflow-visible")}
        hideCloseButton
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: { duration: 0.2, ease: "easeIn" },
            },
          },
        }}
      >
        <ModalContent>
          {() => (
            <Fragment>
              <ModalHeader
                {...moveProps}
                className="flex flex-col text-primary text-lg font-bold"
              >
                {title}
                <p className="text-xs text-muted-foreground ml-0.5">
                  {caption}
                </p>

                <button
                  type="button"
                  data-slot="dialog-close"
                  onClick={() => setIsNewItemOpen(false)}
                  className="absolute bg-background dark:bg-primary/50 dark:text-white -top-6 -right-6 rounded-full shadow-2xl z-9999"
                >
                  <div className="size-7 scale-75 hover:animate-[spin_0.5s_linear_0.5] transition-transform">
                    ✕
                  </div>
                </button>
              </ModalHeader>

              <style>
                {`
                  *::-webkit-scrollbar { width: 8px; height: 8px }
                  *::-webkit-scrollbar-track { background: var(--sidebar) }
                  *::-webkit-scrollbar-thumb { cursor: grabbing; background: var(--chart-1); border-radius: var(--radius-lg) }
                  .dark *::-webkit-scrollbar-thumb { cursor: grabbing; background: var(--sidebar-ring); border-radius: var(--radius-lg) }
                  *::-webkit-scrollbar-thumb:hover { background: var(--primary) }
                `}
              </style>
              {children}
            </Fragment>
          )}
        </ModalContent>
      </Modal>
    </>
  );

  return (
    <Dialog
      open={isNewItemOpen}
      onOpenChange={() => setIsNewItemOpen(!isNewItemOpen)}
    >
      <DialogContent
        ref={dialogRef}
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className={cn(
          "*:data-[slot=dialog-close]:bg-sidebar *:data-[slot=dialog-close]:-inset-e-6 *:data-[slot=dialog-close]:-top-6",
          "*:data-[slot=dialog-close]:size-7 *:data-[slot=dialog-close]:rounded-full *:data-[slot=dialog-close]:border *:data-[slot=dialog-close]:shadow-sm *:data-[slot=dialog-close]:hover:animate-[spin_0.5s_linear_0.5] transition-transform",
          "bg-sidebar",
          "overflow-visible",
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
