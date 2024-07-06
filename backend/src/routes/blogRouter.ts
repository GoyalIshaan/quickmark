import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import {
  createBlogInputSchema,
  updateBlogInputSchema,
} from "@ishaan_goyal/quickmark-common";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

//middleware to verify the jwt token
blogRouter.use("/*", async (c, next) => {
  try {
    const authHeader = c.req.header("authorization") || "";
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if (user) {
      c.set("userId", user.id as string);
      await next();
    } else {
      c.status(401);
      return c.json({ message: "Invalid token" });
    }
  } catch (error) {
    c.status(401);
    return c.json({ message: "Invalid or expired token" });
  }
});

// @desc Create a Bog
// @route POST /api/v1/blog
// @access Private
blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const { success } = createBlogInputSchema.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ message: "Invalid input" });
    }
    const authorId = c.get("userId");
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId,
      },
    });
    return c.json({ id: blog.id });
  } catch (error) {
    c.status(403);
    return c.json({ message: "Couldn't create the blog" });
  }
});

// @desc Edit a Blog
// @route PUT /api/v1/blog
// @access Private
blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = updateBlogInputSchema.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ message: "Invalid input" });
  }

  try {
    await prisma.blog.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({ message: "Blog edited" });
  } catch (error) {
    c.status(403);
    return c.json({ message: "Couldn't edit the blog" });
  }
});

// @desc Get all Blogs
// @route GET /api/v1/blog/bulk
// @access Public
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blogs = await prisma.blog.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      author: {
        select: {
          name: true,
        },
      },
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return c.json({ blogs });
});

// @desc Get a Blog
// @route GET /api/v1/blog/:id
// @access Public
blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");

  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
    });
    return c.json({ blog });
  } catch (error) {
    c.status(403);
    return c.json({ message: "Couldn't get the blog" });
  }
});

export default blogRouter;
