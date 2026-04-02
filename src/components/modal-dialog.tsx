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
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  useDisclosure,
  useDraggable,
} from "@heroui/react";

// * Utils
import { cn } from "@/lib/utils";

export function ModalDialog({
  children,
  isModalOpen,
  setIsModalOpen,
  title,
  caption,
  centerHeader,
  logo,
  onClose,
}: {
  /**
   * Child elements.
   */
  children: ReactNode;
  /**
   * Modal state.
   * @default false
   */
  isModalOpen: boolean;
  /**
   * Sets modal state.
   */
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  /**
   * Modal title.
   */
  title: string;
  /**
   * Modal caption.
   */
  caption: string;
  /**
   * Center the contents of the modal header.
   * @default false
   */
  centerHeader?: boolean;
  /**
   * Image to be presented on the modal header.
   */
  logo?: ReactNode;
  /**
   * Extra actions to perform on modal close, such as navigating back to the previous page.
   * @default () => {}
   */
  onClose?: () => void;
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
        isOpen={isModalOpen}
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
                className={`flex flex-col text-primary text-lg font-bold ${centerHeader ? "items-center" : ""}`}
              >
                {logo}

                {title}
                <p className="text-xs text-muted-foreground ml-0.5">
                  {caption}
                </p>

                <button
                  type="button"
                  data-slot="dialog-close"
                  onClick={() => {
                    onClose?.();
                    setIsModalOpen(false);
                  }}
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
      open={isModalOpen}
      onOpenChange={() => setIsModalOpen(!isModalOpen)}
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

export function HeaderFooter({
  children,
  isSubmitting,
  isValid,
  hideFooter,
  hideFooterCloseButton,
  setIsModalOpen,
  submitText,
}: {
  /**
   * Child elements.
   */
  children: ReactNode;
  /**
   * Extends form submission state.
   * @default false
   */
  isSubmitting: boolean;
  /**
   * Extends form valid state.
   */
  isValid: boolean;
  /**
   * Do not show the footer.
   * @default false
   */
  hideFooter?: boolean;
  /**
   * Do not show the footer close button.
   * @default false
   */
  hideFooterCloseButton?: boolean;
  /**
   * Sets modal state.
   * @default false
   */
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  /**
   * The text to show on the submission button. If not provided, SUBMIT is used.
   * @default 'Submit'
   */
  submitText?: string;
}) {
  return (
    <>
      <ScrollShadow size={50} className="px-5 overflow-x-hidden">
        <div className="flex flex-col gap-3 max-h-[50vh]">{children}</div>
      </ScrollShadow>

      <footer
        className={`${hideFooter ? "mt-2" : "bg-sidebar-accent border-t mt-4"} mx-0 flex gap-2 rounded-b-xl p-4 sm:flex-row ${hideFooterCloseButton ? "sm:justify-center" : "sm:justify-end"}`}
      >
        {!hideFooterCloseButton && (
          <Button
            variant="faded"
            size="sm"
            className="uppercase"
            onPress={() => setIsModalOpen(false)}
          >
            Close
          </Button>
        )}

        <Button
          type="submit"
          variant={isSubmitting ? "flat" : "solid"}
          size="sm"
          fullWidth={hideFooterCloseButton}
          className="w-1/2 uppercase"
          isLoading={isSubmitting}
          isDisabled={isSubmitting || !isValid}
          color="primary"
          spinnerPlacement="end"
        >
          {submitText ? submitText : "Submit"}
          {isSubmitting ? "ing..." : ""}
        </Button>
      </footer>
    </>
  );
}
