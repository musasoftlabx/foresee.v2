// * React
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

// * NPM
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// * HUI
import { Autocomplete, AutocompleteItem } from "@heroui/react";

// * Components
import ModalDialog from "@/components/modal-dialog";

// * Assets
import countries from "../../../public/data/countries.json";

// * Schema
const schema = z.object({
  country: z.object({ code: z.string(), name: z.string() }),
});

import { useDialogRef } from "../modal-dialog";

export const usePortalContainer = () => {
  const ref = useDialogRef();
  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (ref?.current) {
      setContainer(ref.current);
    }
  }, [ref]);

  return container;
};

export default function CreateStore({
  isNewItemOpen,
  setIsNewItemOpen,
}: {
  isNewItemOpen: boolean;
  setIsNewItemOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { register, setValue } = useForm({
    defaultValues: async () => ({
      country: { code: "", name: "" },
    }),
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const dialogRef = useDialogRef();
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    if (dialogRef?.current) {
      setPortalContainer(dialogRef.current);
    }
  }, [dialogRef]);

  if (!portalContainer) return null;

  return (
    <ModalDialog
      isNewItemOpen={isNewItemOpen}
      setIsNewItemOpen={setIsNewItemOpen}
      title="Create Store"
      caption="Enter store details, locations in store & upload inventory"
    >
      <Autocomplete
        isRequired
        isClearable
        variant="faded"
        size="sm"
        label="Country"
        popoverProps={{
          portalContainer,
        }}
        className="overflow-visible"
        defaultItems={countries}
        {...register(`country.name`)}
        onInputChange={(value) =>
          setValue(`country.name`, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          })
        }
      >
        {({ code, country }: { code: string; country: string }) => (
          <AutocompleteItem key={code}>{country}</AutocompleteItem>
        )}
      </Autocomplete>
    </ModalDialog>
  );
}
