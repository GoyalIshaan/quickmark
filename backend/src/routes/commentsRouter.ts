import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { CommentInputSchema } from "@ishaan_goyal/quickmark-common";

const commentRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

//middleware to verify the jwt token
commentRouter.use("/*", async (c, next) => {
  const excludePath = "/api/v1/comment/:blogId";
  const currentPath = c.req.path;

  // Check if the current path matches the exclude path
  const isExcluded = (() => {
    const pattern = excludePath.replace(/:blogId/, "[^/]+");
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(currentPath);
  })();

  if (!isExcluded) {
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
  } else {
    await next();
  }
});

// @desc Create a Comment
// @route POST /api/v1/comment/
// @access Private
commentRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    // const { success, error } = CommentInputSchema.safeParse(body);
    // if (!success) {
    //   c.status(400);
    //   return c.json({ message: `Invalid Input ${error.issues}` });
    // }
    const authorId = c.get("userId");
    const blogId = body.id;
    const comment = await prisma.comment.create({
      data: {
        title: body.title,
        content: body.content,
        authorId,
        blogId,
      },
    });
    return c.json({ id: comment.id });
  } catch (error) {
    c.status(403);
    return c.json({ message: "Couldn't create the blog" });
  }
});

// @desc Edit a Comment
// @route PUT /api/v1/comment
// @access Private
commentRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = CommentInputSchema.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ message: "Invalid input" });
  }
  const commentId = body.id;
  try {
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({ message: "Comment edited" });
  } catch (error) {
    c.status(403);
    return c.json({ message: "Couldn't edit the comment" });
  }
});

// @desc Delete a Comment
// @route DELETE /api/v1/comment/:id/
// @access Private
commentRouter.delete("/:commentId/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const commentId = c.req.param("commentId");

  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return c.json({ message: "Comment deleted" });
  } catch (error) {
    c.status(403);
    return c.json({ message: "Couldn't delete the comment" });
  }
});

// @desc Get all Comments of a Blog
// @route GET /api/v1/comment/:blogId
// @access Private
commentRouter.get("/:blogId", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogId = c.req.param("blogId");

  try {
    const comments = await prisma.comment.findMany({
      where: {
        blogId,
      },
    });

    return c.json({ comments });
  } catch (error) {
    c.status(403);
    return c.json({ message: "Couldn't fetch the comments" });
  }
});

export default commentRouter;
