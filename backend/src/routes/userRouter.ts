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
          name: body.name,
          email: body.email,
          password: body.password,
        },
      });

      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
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

      const token = await sign({ id: user.id }, c.env.JWT_SECRET);

      return c.json({ jwt: token, user: user });
    } catch (error) {
      c.status(403);
      return c.json({ message: "Invalid UserName / Password" });
    }
  } else {
    c.status(400);
    return c.json({ message: "Invalid input" });
  }
});

// @desc Get user
// @route GET /api/v1/user/:id
// @access Private
userRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.req.param("id");
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user) {
    return c.json({ user });
  } else {
    c.status(404);
    return c.json({ message: "User not found" });
  }
});

export default userRouter;
