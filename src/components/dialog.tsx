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
  AlertDialogTrigger,
} from "@/components/ui/shadcn/alert-dialog";
import { Button } from "@/components/ui/button";
import { DeleteIcon } from "@/components/ui/lucide-animated/delete";
import { Input, Textarea } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useDialogStore } from "@/store/useDialogStore";

import parse from "html-react-parser";

export default function Confirm({
  okText = "OK",
  cancelText = "CANCEL",
  comments,
  handleConfirm,
  //handleCancel,
}: {
  okText?: string;
  cancelText?: string;
  comments?: string;
  handleConfirm: () => void;
  //handleCancel?: () => void;
}) {
  const status = useDialogStore((state) => state.status);
  const subject = useDialogStore((state) => state.subject);
  const body = useDialogStore((state) => state.body);

  const [comment, setComment] = useState("");
  // const { mutate } = useMutation({
  //   mutationFn: (body) => axios.put("/tickets/comments", body),
  // });

  const handleCancel = useDialogStore((state) => state.close);

  return (
    <AlertDialog open={useDialogStore((state) => state.isOpen)}>
      {/* <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Chat</Button>
      </AlertDialogTrigger> */}
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <DeleteIcon />
          </AlertDialogMedia>
          <AlertDialogTitle> {subject}</AlertDialogTitle>
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
          <AlertDialogCancel variant="outline" onClick={handleCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              //comments && mutate({ _: comments, comment });
              handleConfirm();
            }}
          >
            {" "}
            {okText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* "use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/shadcn/alert-dialog";

import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

type StatusType = "success" | "warning" | "error" | "info";

const statusConfig: Record<
  StatusType,
  {
    icon: React.ReactNode;
    title: string;
  }
> = {
  success: {
    icon: <CheckCircle2 className="h-10 w-10 text-green-600" />,
    title: "Success Confirmation",
  },
  warning: {
    icon: <AlertTriangle className="h-10 w-10 text-yellow-600" />,
    title: "Warning Confirmation",
  },
  error: {
    icon: <XCircle className="h-10 w-10 text-red-600" />,
    title: "Error Confirmation",
  },
  info: {
    icon: <Info className="h-10 w-10 text-blue-600" />,
    title: "Info Confirmation",
  },
};

export default function ConfirmDialogWithStatusIcon() {
  const [status, setStatus] = React.useState<StatusType>("warning");

  return (
    <div className="flex flex-col gap-4">
   
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStatus("success")}>
          Success
        </Button>
        <Button variant="outline" onClick={() => setStatus("warning")}>
          Warning
        </Button>
        <Button variant="outline" onClick={() => setStatus("error")}>
          Error
        </Button>
        <Button variant="outline" onClick={() => setStatus("info")}>
          Info
        </Button>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Open Confirm Dialog</Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-start gap-3">
              {statusConfig[status].icon}

              <div className="space-y-1">
                <AlertDialogTitle className="text-lg font-semibold">
                  {statusConfig[status].title}
                </AlertDialogTitle>

                <AlertDialogDescription className="text-sm text-muted-foreground">
                  Are you sure you want to continue? This action may affect your
                  account settings.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
 */
