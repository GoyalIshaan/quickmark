import zod from "zod";

export const createBlogInputSchema = zod.object({
  title: zod.string().max(75),
  content: zod.string(),
});

export const updateBlogInputSchema = zod.object({
  id: zod.string().uuid(),
  title: zod.string().max(75).optional(),
  content: zod.string().optional(),
});

export type CreateBlogInput = zod.infer<typeof createBlogInputSchema>;
export type UpdateBlogInput = zod.infer<typeof updateBlogInputSchema>;
