import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import {
  signInInputSchema,
  signUpInputSchema,
} from "@ishaan_goyal/quickmark-common";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

type User = {
  id: string;
  email: string;
  name: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

const FIVE_DAYS_FROM_NOW = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5;

const TokenGenerator = async (
  user: User,
  secretKey: string
): Promise<string> => {
  const payload = {
    id: user.id,
    email: user.email,
    role: "user",
    exp: Math.floor(FIVE_DAYS_FROM_NOW),
  };
  const token = await sign(payload, secretKey);
  return token;
};

// @desc Create a user
// @route POST /api/v1/signup
// @access Public
userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signUpInputSchema.safeParse(body);

  if (success) {
    try {
      const user: User | null = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
        },
      });

      const jwt = await TokenGenerator(user, c.env.JWT_SECRET);

      return c.json({ jwt });
    } catch (error) {
      c.status(403);
      return c.json({ message: "Couldn't create the user" });
    }
  } else {
    c.status(400);
    return c.json({ message: "Invalid input" });
  }
});

// @desc Login user
// @route POST /api/v1/signin
// @access Public
userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signInInputSchema.safeParse(body);
  if (success) {
    try {
      const user: User | null = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (!user || user.password !== body.password) {
        c.status(403);
        return c.json({ message: "Invalid UserName / Password" });
      }

      const jwt = await TokenGenerator(user, c.env.JWT_SECRET);

      return c.json({ jwt });
    } catch (error) {
      c.status(403);
      return c.json({ message: "Invalid UserName / Password" });
    }
  } else {
    c.status(400);
    return c.json({ message: "Invalid input" });
  }
});

export default userRouter;
