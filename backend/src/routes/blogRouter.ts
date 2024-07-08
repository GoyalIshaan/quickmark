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

// Middleware to verify the JWT token and apply conditionally
blogRouter.use("/*", async (c, next) => {
  const excludePaths = [
    "/api/v1/blog/bulk",
    "/api/v1/blog/:id",
    "/api/v1/blog/author/:authorId/",
    "/api/v1/blog/likes/:blogId/",
    "/api/v1/blog/saved/:blogId/",
  ];
  const currentPath = c.req.path;

  // Check if the current path matches any of the exclude paths
  const isExcluded = excludePaths.some((path) => {
    const regex = new RegExp(`^${path.replace(/:[^\s/]+/g, "[^/]+")}$`);
    return regex.test(currentPath);
  });

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

// @desc Create a Blog
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

// @desc Get all Blogs with Pagination
// @route GET /api/v1/blog/bulk
// @access Public
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const page = parseInt(c.req.query("page") || "1") || 1;
  const limit = parseInt(c.req.query("limit") || "10") || 10;
  const skip = (page - 1) * 10;

  const blogs = await prisma.blog.findMany({
    skip: skip,
    take: limit,
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

  const totalBlogs = await prisma.blog.count();
  const totalPages = Math.ceil(totalBlogs / limit);

  return c.json({ blogs, totalPages });
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
            id: true,
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

// @desc Get Your Own Blogs with Pagination
// @route GET /api/v1/blog/author/
// @access Private
blogRouter.get("/author/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const authorId = c.get("userId");
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "6");
  const skip = (page - 1) * limit;

  try {
    const blogs = await prisma.blog.findMany({
      where: { authorId },
      skip: skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const totalBlogs = await prisma.blog.count({ where: { authorId } });
    const totalPages = Math.ceil(totalBlogs / limit);

    return c.json({ blogs, totalPages, currentPage: page });
  } catch (error) {
    c.status(403);
    return c.json({ message: "Couldn't get the blog" });
  }
});

// @desc Get All The Blogs of a User
// @route GET /api/v1/blog/author/:authorId
// @access Public
blogRouter.get("/author/:authorId/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const authorId = c.req.param("authorId");
  const page = parseInt(c.req.query("page") || "1") || 1;
  const limit = parseInt(c.req.query("limit") || "10") || 10;
  const skip = (page - 1) * 10;

  try {
    const blogs = await prisma.blog.findMany({
      skip: skip,
      take: limit,
      where: {
        authorId,
      },
    });
    const totalBlogs = await blogs.length;
    const totalPages = Math.ceil(totalBlogs / limit);
    return c.json({ blogs, totalPages });
  } catch (error) {
    c.status(403);
    return c.json({ message: "Couldn't get the blog" });
  }
});

// @desc Delete a Blog
// @route DELETE /api/v1/blog/:blogId
// @access Private
blogRouter.delete("/:blogId", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogId = c.req.param("blogId");

  try {
    await prisma.blog.delete({
      where: {
        id: blogId,
      },
    });
    return c.json({ message: "Blog deleted" });
  } catch (error) {
    c.status(403);
    return c.json({ message: error });
  }
});

// @desc Get all likes
// @route GET /api/v1/blog/likes/:blogId
// @access Public
blogRouter.get("/likes/:blogId/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blogId = c.req.param("blogId");
  try {
    const likeCount = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      select: {
        _count: {
          select: {
            likedBy: true,
          },
        },
      },
    });

    c.status(200);
    return c.json({ number: likeCount?._count?.likedBy ?? 0 });
  } catch (error) {
    c.status(403);
    return c.json({ message: "Couldn't get the likes" });
  }
});

// @desc Get all saved
// @route GET /api/v1/blog/saved/:blogId
// @access Public
blogRouter.get("/saved/:blogId/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blogId = c.req.param("blogId");
  try {
    const saveCount = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      select: {
        _count: {
          select: {
            savedBy: true,
          },
        },
      },
    });

    c.status(200);
    return c.json({ number: saveCount?._count?.savedBy ?? 0 });
  } catch (error) {
    c.status(403);
    return c.json({ message: "Couldn't get the saves" });
  }
});

export default blogRouter;
