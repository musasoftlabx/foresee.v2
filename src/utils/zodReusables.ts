import * as z from "zod";

export const zString = z.string();

export const zStringMax = (max: number) =>
  z.string().max(max, "Max of ${max} chars.");

export const zNumber = z.number().positive().gt(0);

export const zOTP = z
  .number()
  .positive()
  .min(0)
  .max(9999)

  .refine((value: number) => {
    const length = 4;
    return (
      value.toString().length === length,
      { error: `Must be exactly ${length} chars.` }
    );
  });

export const zUsername = z.string().min(3, "Less characters.");

export const zPassword = z
  .string()
  .regex(
    /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
    "At least 8 chars, 1 number, 1 uppercase, 1 lowercase and 1 special char."
  );

export const zPasscode = z.string().min(5, {
  error: (issue) => `Should be a minimum of ${issue.minimum} chars.`,
});

export const zEmailAddress = z.email("Invalid email.").max(50, {
  error: (issue) => `Max of ${issue.minimum} chars.`,
});

export const zPhoneNumber = z
  .string()
  .min(10, "Must be ${min} chars.")
  .refine((value) => value?.startsWith("07") || value?.startsWith("01"), {
    error: "Use format 07xxxxxxxx.",
  });
