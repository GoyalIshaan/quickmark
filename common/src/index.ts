import zod from "zod";

export const signUpInputSchema = zod.object({
  name: zod.string().min(3).max(20).optional(),
  email: zod.string().email(),
  password: zod.string().min(6),
});

export const signInInputSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
});

export const createBlogInputSchema = zod.object({
  title: zod.string().max(75),
  content: zod.string(),
});

export const updateBlogInputSchema = zod.object({
  id: zod.string().uuid(),
  title: zod.string().max(75).optional(),
  content: zod.string().optional(),
});

export const CommentInputSchema = zod.object({
  id: zod.string().uuid(),
  title: zod.string().max(75),
  content: zod.string().min(10),
});

export type CreateBlogInput = zod.infer<typeof createBlogInputSchema>;
export type UpdateBlogInput = zod.infer<typeof updateBlogInputSchema>;
export type SignUpInput = zod.infer<typeof signUpInputSchema>;
export type SignInInput = zod.infer<typeof signInInputSchema>;
export type CommentInput = zod.infer<typeof CommentInputSchema>;
