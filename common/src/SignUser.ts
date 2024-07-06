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

export type SignUpInput = zod.infer<typeof signUpInputSchema>;
export type SignInInput = zod.infer<typeof signInInputSchema>;
