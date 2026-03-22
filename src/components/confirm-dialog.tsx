// * React
import { useState } from "react";

// * NPM
import parse from "html-react-parser";

// * SUI
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "./ui/shadcn/alert-dialog";

// * HUI
import { Textarea } from "@heroui/react";

// * Icons
import { BadgeInfoIcon } from "lucide-react";
import { useConfirmDialogStore } from "@/store/useConfirmDialogStore";

export default function Dialog({
  okText = "OK",
  cancelText = "CANCEL",
  comments,
  handleConfirm,
  handleCancel,
}: {
  okText?: string;
  cancelText?: string;
  comments?: string;
  handleConfirm: () => void;
  handleCancel?: () => void;
}) {
  const icon = useConfirmDialogStore((state) => state.icon);
  const status = useConfirmDialogStore((state) => state.status);
  const subject = useConfirmDialogStore((state) => state.subject);
  const body = useConfirmDialogStore((state) => state.body);

  const [comment, setComment] = useState("");

  const statusClassNames = () => {
    switch (status) {
      case "error":
        return "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive";
      case "warning":
        return "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive";
      case "success":
        return "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive";
      case "info":
        return "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive";
    }
  };

  return (
    <AlertDialog open={useConfirmDialogStore((state) => state.isOpen)}>
      <AlertDialogContent size="sm" className="bg-card">
        <AlertDialogHeader>
          <AlertDialogMedia className={statusClassNames()}>
            {icon ?? <BadgeInfoIcon />}
          </AlertDialogMedia>
          <AlertDialogTitle>{subject}</AlertDialogTitle>
          <AlertDialogDescription>{parse(body ?? "")}</AlertDialogDescription>
          {comments && (
            <Textarea
              className="max-w-xs"
              description={`${comment.length} chars`}
              label="Description"
              placeholder="Enter your description"
              variant="faded"
              size="sm"
              isRequired
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="ghost" onClick={handleCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => handleConfirm()}
          >
            {okText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
