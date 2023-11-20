import { z } from "zod";

export const createGroup = z.object({
  body: z.object({
    groupName: z
      .string({
        required_error: "Group name is required",
      })
      .min(3, "Group name must be at least 3 character long"),
    groupDescription: z.string({}).optional(),
    ownerId: z.string({
      required_error: "Group owner id is required",
    }),
  }),
});

export const createGroupMembers = z.object({
  body: z.object({
    groupId: z.string({
      required_error: "Group's id id is required",
    }),
    memberId: z.string({
      required_error: "Group's member id is required",
    }),
    addedBy: z.string({
      required_error: "Added by user id is required",
    }),
  }),
});

export type CreateGroup = z.infer<typeof createGroup>["body"];
export type CreateGroupMembers = z.infer<typeof createGroupMembers>["body"];
