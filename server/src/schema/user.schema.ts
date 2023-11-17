import { z } from "zod";

export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string({
        required_error: "User name is required!",
        invalid_type_error: "User name should be string",
      }),
      email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email format"),
      picture: z.string().optional(),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 character long"),
      confirm_password: z
        .string({ required_error: "Confirm password is required" })
        .min(6, "Confirm password must be at least 6 character long"),
    })
    .refine((data) => data.confirm_password === data.password, {
      message: "confirm did not match!",
      path: ["confirm_password"],
    }),
});

export const loginUserSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "User name is required!",
      invalid_type_error: "User name should be string",
    }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 character long"),
  }),
});

export type CreateUserType = Omit<
  z.infer<typeof createUserSchema>["body"],
  "confirm_password"
>;
export type LoginUserType = z.infer<typeof loginUserSchema>["body"];
