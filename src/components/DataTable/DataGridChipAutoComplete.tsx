// * React
import { useState } from "react";

// * NPM
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// * MUI
import { GridRowId } from "@mui/x-data-grid-pro";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";

// * Stores
import { useSnackBarStore } from "@/store/useToastStore";

// * Icons
import { MdCheckBox } from "react-icons/md";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";

export default function DataGridChipAutoComplete({
  apiUrl,
  id,
  entity,
  field,
  values,
  dataset,
}: {
  apiUrl: string;
  id: number;
  entity: string;
  field: string;
  values: string[];
  dataset: string[];
}) {
  // ? Hooks
  const setSnackBar = useSnackBarStore((state) => state.setSnackBar);

  // ? States
  const [newRoles, setNewRoles] = useState(values ? values : []);

  // ? Mutations
  const { mutate: updateData } = useMutation(
    (body: { id: GridRowId; field: string; value: string }) =>
      axios.patch(apiUrl, body),
  );

  return (
    <Autocomplete
      multiple
      options={dataset}
      disableCloseOnSelect
      fullWidth
      getOptionLabel={(option) => option}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<MdOutlineCheckBoxOutlineBlank size={24} />}
            checkedIcon={<MdCheckBox size={24} />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} placeholder={`${entity}...`} />
      )}
      size="small"
      value={newRoles}
      onChange={(e, selected) => {
        setNewRoles(selected);
        updateData(
          { id, field, value: JSON.stringify(selected.sort()) },
          {
            onSuccess: () =>
              setSnackBar({
                duration: 3000,
                message: "Record Updated!",
              }),
            onError: () =>
              setSnackBar({
                duration: 3000,
                message: "Record was not updated!",
              }),
          },
        );
      }}
      sx={{ ".MuiOutlinedInput-notchedOutline": { border: 0 } }}
    />
  );
}
