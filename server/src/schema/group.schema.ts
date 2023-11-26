import { z } from "zod";

export const createGroup = z.object({
  body: z.object({
    groupName: z
      .string({
        required_error: "Group name is required",
      })
      .min(3, "Group name must be at least 3 character long"),
    groupDescription: z.string({}).optional(),
    ownerId: z.array(z.string()),
    customUniqueGroupId: z.string().optional(),
    groupUserNames: z.array(z.string()).optional(),
  }),
});

export const createGroupMembers = z.object({
  body: z.object({
    groupMembers: z.array(
      z.object({
        groupId: z.string({
          required_error: "Group's id id is required",
        }),
        memberId: z.string({
          required_error: "Group's member id is required",
        }),
        addedBy: z.string({
          required_error: "Added by user id is required",
        }),
        status: z.enum(["Accept", "Pending"]).optional(),
      })
    ),
  }),
});

export const getDataByUserId = z.object({
  params: z.object({
    userId: z.string({
      required_error: "User id is required!",
    }),
  }),
});

export const getDataByIdSchema = z.object({
  query: z.object({
    groupId: z
      .string({
        required_error: "Group id is required!",
      })
      .optional(),
    groupIdForMembers: z
      .string({
        required_error: "Group id is required!",
      })
      .optional(),
  }),
});

export const editGroupMemberSchema = z.object({
  params: z.object({
    groupMemberId: z.string(),
  }),
  body: z.object({
    groupId: z.string().optional(),
    memberId: z.string().optional(),
    addedBy: z.string().optional(),
    status: z.string().optional(),
  }),
});
export const deleteGroupMemberSchema = z.object({
  body: z.object({
    _id: z.string().optional(),
    groupId: z.string().optional(),
    memberId: z.string().optional(),
  }),
});

export const deleteGroupSchema = z.object({
  body: z.object({
    _id: z.string(),
    ownerId: z.array(z.string()),
  }),
});

export type CreateGroup = z.infer<typeof createGroup>["body"];
export type CreateGroupMembers = z.infer<typeof createGroupMembers>["body"];
export type GetDataByUserId = z.infer<typeof getDataByUserId>["params"];
export type GetDataByIdType = z.infer<typeof getDataByIdSchema>["query"];
export type EditGroupMemberType = z.infer<typeof editGroupMemberSchema>;
export type DeleteGroupMemberType = z.infer<
  typeof deleteGroupMemberSchema
>["body"];
export type DeleteGroupType = z.infer<typeof deleteGroupSchema>["body"];
