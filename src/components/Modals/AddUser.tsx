// * NPM
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import axios from "axios";

// * MUI
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType, boolean, object, string } from "yup";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// * Components
import { CloseButtonX } from "@/shared/components/InputFields/CloseButtonX";
import { TextFieldX } from "@/shared/components/InputFields/TextFieldX";
import ButtonX from "@/shared/components/InputFields/ButtonX";
import PhoneNumberX from "../InputFields/PhoneNumberX";

// * Icons
import { BsFillPhoneVibrateFill, BsTextWrap } from "react-icons/bs";
import { GoMail } from "react-icons/go";
import {
  MdAccountCircle,
  MdAlternateEmail,
  MdOutlineAccountTree,
  MdOutlineSupervisedUserCircle,
} from "react-icons/md";
import {
  PiPhoneCall,
  PiTreeStructure,
  PiTreeStructureLight,
} from "react-icons/pi";
import { RiAccountPinBoxLine, RiMailSendLine } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";

// * Store
import { useAlertStore } from "@/store/useAlertStore";

// * Shared
import ModalStyles from "@/shared/ModalStyles";

// * Utils
import { yupPhoneNumber, yupString } from "@/utils/zodReusables";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const schema = object({
  firstName: yupString,
  middleName: string(),
  lastName: yupString,
  emailAddress: string().email("Invalid email").max(50, "Max of 50 chars"),
  phoneNumber: yupPhoneNumber,
  role: yupString,
  description: string(),
  isValid: boolean(),
});

type AddUser = InferType<typeof schema>;

export default function AddUser({
  roles,
  isAddModalOpen,
  setIsAddModalOpen,
  handleGetData,
}: {
  roles: string[];
  isAddModalOpen: boolean;
  setIsAddModalOpen: (status: boolean) => void;
  handleGetData: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    setFocus,
    formState: { errors, isValid, isSubmitting, dirtyFields: dirty },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  // ? Hooks
  const showAlert = useAlertStore((state) => state.alert);

  // ? Mutations
  const { mutate: addUser } = useMutation({
    mutationFn: (body: AddUser) => axios.post("users?scope=user", body),
  });

  return (
    <>
      <Modal open={isAddModalOpen} closeAfterTransition>
        <motion.div
          initial={{ opacity: 0, scale: 2, y: "0%" }}
          animate={{ opacity: 1, scale: 1, y: "calc(50vh)" }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          exit={{ opacity: 0, y: 100 }}
        >
          <Paper sx={ModalStyles({ minWidth: "300px", maxWidth: "40vw" })}>
            <Stack
              direction="row"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                color="primary"
                fontSize={20}
                fontWeight="bold"
                sx={(theme) => ({
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                  px: 3,
                })}
              >
                Add user
              </Typography>

              <CloseButtonX
                sx={{ mr: 1 }}
                onClick={() => setIsAddModalOpen(false)}
              />
            </Stack>

            <Box maxHeight="80vh" overflow="auto">
              <form
                onSubmit={handleSubmit((formdata: AddUser) =>
                  addUser(formdata, {
                    onSuccess: ({ data }) => {
                      console.log(data);
                    },
                  })
                )}
              >
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextFieldX
                      {...field}
                      label="First Name *"
                      error={
                        dirty.firstName && Boolean(errors.firstName?.message)
                      }
                      helperText={dirty.firstName && errors.firstName?.message}
                      prefixcon={<RiAccountPinBoxLine size={24} />}
                      columnspan={{ xs: 12 }}
                      slotprops={{ htmlInput: { maxLength: 20 } }}
                      {...register("firstName")}
                    />
                  )}
                />

                <Controller
                  name="middleName"
                  control={control}
                  render={({ field }) => (
                    <TextFieldX
                      {...field}
                      label="Middle Name"
                      error={
                        dirty.middleName && Boolean(errors.middleName?.message)
                      }
                      helperText={
                        dirty.middleName && errors.middleName?.message
                      }
                      prefixcon={<RiAccountPinBoxLine size={24} />}
                      columnspan={{ xs: 12 }}
                      slotProps={{ htmlInput: { maxLength: 20 } }}
                      {...register("middleName")}
                    />
                  )}
                />

                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextFieldX
                      {...field}
                      label="Last Name *"
                      error={
                        dirty.lastName && Boolean(errors.lastName?.message)
                      }
                      helperText={dirty.lastName && errors.lastName?.message}
                      prefixcon={<RiAccountPinBoxLine size={24} />}
                      columnspan={{ xs: 12 }}
                      slotProps={{ htmlInput: { maxLength: 20 } }}
                      {...register("lastName")}
                    />
                  )}
                />

                <Controller
                  name="emailAddress"
                  control={control}
                  render={({ field }) => (
                    <TextFieldX
                      {...field}
                      label="Email Address (Optional)"
                      error={
                        dirty.emailAddress &&
                        Boolean(errors.emailAddress?.message)
                      }
                      helperText={
                        dirty.emailAddress && errors.emailAddress?.message
                      }
                      prefixcon={<RiMailSendLine size={22} />}
                      columnspan={{ xs: 12 }}
                      slotProps={{ htmlInput: { maxLength: 50 } }}
                      {...register("emailAddress")}
                    />
                  )}
                />

                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <TextFieldX
                      {...field}
                      label="Phone Number *"
                      error={
                        dirty.phoneNumber &&
                        Boolean(errors.phoneNumber?.message)
                      }
                      helperText={
                        dirty.phoneNumber && errors.phoneNumber?.message
                      }
                      prefixcon={<PiPhoneCall size={24} />}
                      columnspan={{ xs: 6 }}
                      slotProps={{ htmlInput: { maxLength: 20 } }}
                      //mask="xxxxxxxxxx"
                      {...register("phoneNumber")}
                    />
                  )}
                />

                {/* <PhoneNumberX /> */}

                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <TextFieldX
                      {...field}
                      label="Role *"
                      error={dirty.role && Boolean(errors.role?.message)}
                      helperText={dirty.role && errors.role?.message}
                      prefixcon={<PiTreeStructure size={24} />}
                      columnspan={{ xs: 12 }}
                      slotProps={{ htmlInput: { maxLength: 50 } }}
                      select
                      {...register("role")}
                    >
                      <MenuItem disabled>Select a role</MenuItem>
                      {roles?.map((role, key) => (
                        <MenuItem key={key} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </TextFieldX>
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextFieldX
                      {...field}
                      label="Description *"
                      error={
                        dirty.description &&
                        Boolean(errors.description?.message)
                      }
                      helperText={
                        dirty.description &&
                        Boolean(errors.description?.message)
                          ? errors.description?.message
                          : " "
                      }
                      prefixcon={<BsTextWrap size={24} />}
                      columnspan={{ xs: 12 }}
                      slotprops={{ htmlInput: { maxLength: 100 } }}
                      slots={{
                        formHelperText: (a) => (
                          <Typography
                            variant="caption"
                            fontSize={11}
                            sx={{ color: "text.disabled", mt: 0.3, ml: 1 }}
                          >
                            {field.value &&
                              field.value?.length > 0 &&
                              `Chars: ${field.value?.length ?? 0} / 100`}
                          </Typography>
                        ),
                      }}
                      multiline
                      rows={5}
                      {...register("description")}
                    />
                  )}
                />

                <Controller
                  name="isValid"
                  control={control}
                  render={({ field }) => {
                    console.log(field);

                    return (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={field.value?.isValid as boolean}
                          />
                        }
                        label={
                          <Stack mt={1}>
                            <Typography variant="body1">
                              Is Supplementary?
                            </Typography>
                            <Typography
                              variant="caption"
                              mt={0.5}
                              sx={{ opacity: 0.7 }}
                            >
                              Supplementaries are allocations added within the
                              month, (around the 22nd date). If the allocations
                              are new, (beggining of month), leave this switch
                              off to safely delete previous allocations.
                            </Typography>
                          </Stack>
                        }
                        sx={{ alignItems: "start", ml: 0.5 }}
                      />
                    );
                  }}
                />

                <ButtonX
                  variant="contained"
                  placement="right"
                  size="medium"
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                  loadingtext="LOADING..."
                >
                  ADD USER
                  <IoIosAdd
                    size={20}
                    style={{ marginRight: -5, marginTop: -3 }}
                  />
                </ButtonX>
              </form>
            </Box>
          </Paper>
        </motion.div>
      </Modal>

      {/* <DevTool control={control} /> */}
    </>
  );
}
