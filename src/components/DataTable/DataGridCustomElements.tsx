"use client";

// * React
import { useState } from "react";

// * NPM
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

// * MUI
import { red } from "@mui/material/colors";
import { GridRowId } from "@mui/x-data-grid-pro";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";

// * Components
import { TextFieldX } from "../InputFields/TextFieldX";

// * Store
import { useSnackBarStore } from "@/store/useToastStore";

// * Icons
import { RiDeleteBinLine } from "react-icons/ri";

// * Hooks
import { iProfile } from "../../../hooks/useJWT";

type iDataGridSwitch = {
  id: number;
  isChecked: boolean;
  profile?: Pick<iProfile, "username" | "role">;
  field: string;
  apiUrl: string;
  permissions: PermissionProps;
  setData: React.Dispatch<React.SetStateAction<any>>;
  handleGetData: () => void;
};

const DataGridSwitch = ({
  id,
  isChecked,
  profile,
  field,
  apiUrl,
  permissions,
  setData,
  handleGetData,
}: iDataGridSwitch) => {
  // ? Hooks
  const setSnackBar = useSnackBarStore((state) => state.setSnackBar);

  // ? States
  const [multiRejectAnchorEl, setMultiRejectAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [reasonForDeactivation, setReasonForDeactivation] = useState<string>();

  // ? Mutations
  const { mutate: updateData } = useMutation(
    (body: {
      id: GridRowId;
      field?: string;
      reason?: string | null;
      value?: string | number | boolean;
    }) => axios.patch(apiUrl, body),
  );

  const handleSwitchChange = (checkedStatus: boolean) => {
    setMultiRejectAnchorEl(null);

    const toggleActiveStatus = () =>
      setData((prev: any) => ({
        ...prev,
        dataset: [
          ...prev.dataset.map((row: { id: number; field: any }) => {
            if (row.id === id)
              row[field as keyof typeof row] = !row[field as keyof typeof row];
            return row;
          }),
        ],
      }));

    toggleActiveStatus();

    updateData(
      {
        id,
        field,
        value: checkedStatus,
        reason: checkedStatus ? null : reasonForDeactivation,
      },
      {
        onSuccess: () => {
          setSnackBar({
            duration: 3000,
            message: `${checkedStatus ? "Active!" : "Deactivated!"}!`,
          });
          handleGetData();
        },
        onError: () => {
          toggleActiveStatus();
          setSnackBar({
            duration: 3000,
            message: "Record was not updated!",
          });
        },
      },
    );
  };

  return (
    <>
      <Popover
        open={Boolean(multiRejectAnchorEl)}
        anchorEl={multiRejectAnchorEl}
        onClose={() => setMultiRejectAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Stack justifyContent="end">
          <TextFieldX
            label="Reason for deactivation *"
            columnspan={{ xs: 12 }}
            inputProps={{ maxLength: 100 }}
            multiline
            rows={2}
            value={reasonForDeactivation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setReasonForDeactivation(e.target.value)
            }
          />

          <Button
            variant="text"
            size="small"
            onClick={() => {
              setMultiRejectAnchorEl(null);
              handleSwitchChange(false);
            }}
            sx={{ alignSelf: "end", mt: -1 }}
          >
            SUBMIT
          </Button>
        </Stack>
      </Popover>

      <Switch
        checked={isChecked}
        disabled={
          !permissions?.readWriteRoles?.includes(profile?.role) ||
          !permissions?.readWriteUsers?.includes(profile?.username)
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          e.target.checked
            ? handleSwitchChange(e.target.checked)
            : setMultiRejectAnchorEl(e.currentTarget as any);
        }}
      />
    </>
  );
};

const DataGridDelete = ({
  id,
  profile,
  entity,
  permissions,
  changeRowSelection,
  showConfirm,
}: Pick<iDataGridSwitch, "id" | "profile" | "permissions"> & {
  entity: string;
  changeRowSelection: (arg0: number[]) => void;
  showConfirm: any;
}) => (
  <IconButton
    disabled={
      !permissions?.readWriteRoles?.includes(profile?.role) ||
      !permissions?.readWriteUsers?.includes(profile?.username)
    }
    onClick={() => {
      changeRowSelection([id]);
      showConfirm({
        operation: "delete",
        status: "info",
        subject: `Confirm ${entity} deletion`,
        body: `Are you sure you intend to delete this ${entity}?`,
      });
    }}
    color="error"
    sx={{
      background: red[100],
      mt: -0.5,
      "&:hover": { background: red[200], color: "#fff" },
    }}
  >
    <RiDeleteBinLine size={20} />
  </IconButton>
);

export { DataGridSwitch, DataGridDelete };
