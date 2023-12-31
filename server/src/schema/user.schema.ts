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
      message: "confirm password did not match!",
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

export const userIdArraySchema = z.object({
  body: z.object({
    userIdArray: z.array(z.string()),
  }),
});

export const editUserSchema = z.object({
  params: z.object({
    userId: z.string({
      required_error: "User id is required!",
    }),
  }),
  body: z.object({
    name: z
      .string({
        required_error: "User name is required!",
        invalid_type_error: "User name should be string",
      })
      .optional(),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format")
      .optional(),
    notification: z.array(z.any()).optional(),
  }),
});

export const removeNotificationOfUserSchema = z.object({
  params: z.object({
    userId: z.string({
      required_error: "User id is required!",
    }),
  }),
  body: z.object({
    notification: z.any(),
  }),
});

export const addFriendForUserSchema = z.object({
  params: z.object({
    userId: z.string({
      required_error: "User id is required!",
    }),
  }),
  body: z.object({
    friendIds: z.array(
      z.object({
        friendId: z.string(),
        status: z.string().default("Pending"),
        email: z.string().optional(),
        picture: z.string().optional(),
        name: z.string().optional(),
      })
    ),
  }),
});

export const acceptFriendForUserSchema = z.object({
  params: z.object({
    userId: z.string({
      required_error: "User id is required!",
    }),
  }),
  body: z.object({
    friendId: z.string(),
    status: z.string().default("Friended"),
    customUniqueGroupId: z.string().optional(),
    groupId: z.string().optional(),
  }),
});
export const declineFriendForUserSchema = z.object({
  params: z.object({
    userId: z.string({
      required_error: "User id is required!",
    }),
  }),
  body: z.object({
    friendId: z.string(),
  }),
});

export type CreateUserType = Omit<
  z.infer<typeof createUserSchema>["body"],
  "confirm_password"
>;
export type LoginUserType = z.infer<typeof loginUserSchema>["body"];
export type UserIdArrayType = z.infer<typeof userIdArraySchema>["body"];
export type EditUserType = z.infer<typeof editUserSchema>;
export type RemoveNotificationOfUserType = z.infer<
  typeof removeNotificationOfUserSchema
>;
export type AddFriendForUserType = z.infer<typeof addFriendForUserSchema>;
export type AcceptFriendForUserType = z.infer<typeof acceptFriendForUserSchema>;
export type DeclineFriendForUserType = z.infer<
  typeof declineFriendForUserSchema
>;
