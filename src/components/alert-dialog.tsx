// * NPM
import parse from "html-react-parser";

// * SUI
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "./ui/shadcn/alert-dialog";
import { useAlertDialogStore } from "@/store/useAlertDialogStore";

// * Icons
import { BadgeInfoIcon } from "lucide-react";

export default function Dialog({ okText = "OK" }: { okText?: string }) {
  const icon = useAlertDialogStore((state) => state.icon);
  const status = useAlertDialogStore((state) => state.status);
  const subject = useAlertDialogStore((state) => state.subject);
  const body = useAlertDialogStore((state) => state.body);
  const handleCancel = useAlertDialogStore((state) => state.close);

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
    <AlertDialog open={useAlertDialogStore((state) => state.isOpen)}>
      <AlertDialogContent size="sm" className="bg-card">
        <AlertDialogHeader>
          <AlertDialogMedia className={statusClassNames()}>
            {icon ?? <BadgeInfoIcon />}
          </AlertDialogMedia>
          <AlertDialogTitle>{subject}</AlertDialogTitle>
          <AlertDialogDescription>{parse(body ?? "")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction variant="destructive" onClick={handleCancel}>
            {okText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
