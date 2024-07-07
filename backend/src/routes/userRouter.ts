import { Hono } from "hono";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import {
  signInInputSchema,
  signUpInputSchema,
} from "@ishaan_goyal/quickmark-common";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
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

// Middleware to verify the JWT token and apply conditionally
userRouter.use("/*", async (c, next) => {
  const excludePaths = [
    "/api/v1/user/signup",
    "/api/v1/user/signin",
    "/api/v1/user/followers/:authorId",
  ];
  const currentPath = c.req.path;

  // Check if the current path matches any of the exclude paths
  const isExcluded = excludePaths.some((path) => {
    // Convert the exclude path to a regex pattern
    const pattern = path.replace(/:\w+/g, "[^/]+");
    const regex = new RegExp(`^${pattern}$`);
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

// @desc Get user By Id
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

// @desc Update user
// @route PUT /api/v1/user/:id
// @access Private
userRouter.put("/:userId", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.req.param("userId");
  const body = await c.req.json();
  const duplicate = await prisma.user.findUnique({
    where: { email: body.email },
  });
  if (duplicate) {
    c.status(400);
    return c.json({ message: "Email already exists" });
  }
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: body?.name,
      email: body?.email,
      password: body?.password,

      updatedAt: new Date(),
    },
  });

  return c.json({ user });
});

// @desc Delete user
// @route DELETE /api/v1/user/:id
// @access Private
userRouter.delete("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.req.param("id");
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return c.json({ message: "User deleted" });
  } catch (error) {
    c.status(400);
    return c.json({ message: "User not deleted" });
  }
});

// @desc Follow A User
// @route POST /api/v1/user/follow/:idToFollow
// @access Private
userRouter.post("/follow/:idToFollow", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");
  const idToFollow = c.req.param("idToFollow");

  try {
    await prisma.following.create({
      data: {
        followerId: userId,
        followingId: idToFollow,
      },
    });
  } catch (error) {
    c.status(400);
    throw new Error("Couldn't follow the user");
  }

  c.status(200);
  return c.json({ message: "User followed" });
});

//desc Unfollow A User
// @route DELETE /api/v1/user/unfollow/:idToUnfollow
// @access Private
userRouter.delete("/unfollow/:idToUnfollow", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");
  const idToUnfollow = c.req.param("idToUnfollow");

  try {
    await prisma.following.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: idToUnfollow,
        },
      },
    });
  } catch (error) {
    c.status(400);
    throw new Error("Couldn't unfollow the user");
  }

  c.status(200);
  return c.json({ message: "User unfollowed" });
});

// @desc Get all followers
// @route GET /api/v1/user/followers
// @access Private
userRouter.get("/followers/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");

  try {
    const followers = await prisma.following.findMany({
      where: {
        followingId: userId,
      },
      select: {
        followerId: true,
      },
    });

    c.status(200);
    return c.json({ followers });
  } catch (error) {
    console.error("Error fetching followers:", error);
    c.status(400);
    return c.json({ message: "Couldn't get followers" });
  }
});

// @desc Get Number of followers of user
// @route GET /api/v1/user/followers/:authorId
// @access Public
userRouter.get("/followers/:authorId", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const authorId = c.req.param("authorId");

  try {
    const followers = await prisma.following.count({
      where: {
        followingId: authorId,
      },
    });

    c.status(200);
    return c.json({ followers });
  } catch (error) {
    c.status(400);
    return c.json({ message: "Couldn't get followers" });
  }
});

// @desc Get all following
// @route GET /api/v1/user/following
// @access Private
userRouter.get("/following/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  try {
    const following = await prisma.following.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });
    c.status(200);
    return c.json({ following });
  } catch (error) {
    c.status(400);
    throw new Error("Couldn't get followed");
  }
});

// @desc Get all saved
// @route GET /api/v1/user/save
// @access Private
userRouter.get("/save/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  try {
    const savedBlogs = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        saved: true,
      },
    });
    c.status(200);
    return c.json({ savedBlogs });
  } catch (error) {
    c.status(400);
    throw new Error("Couldn't get saved blogs");
  }
});

// @desc Save a blog
// @route POST /api/v1/user/save/:blogId
// @access Private
userRouter.post("/save/:blogId/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  const blogId = c.req.param("blogId");
  try {
    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          saved: {
            connect: {
              id: blogId,
            },
          },
        },
      }),
      prisma.blog.update({
        where: {
          id: blogId,
        },
        data: {
          savedBy: {
            connect: {
              id: userId,
            },
          },
        },
      }),
    ]);
    c.status(200);
    return c.json({ message: "Blog saved" });
  } catch (error) {
    c.status(400);
    throw new Error("Couldn't save the blog");
  }
});

// @desc Unsave a blog
// @route POST /api/v1/user/unsave/:blogId/
// @access Private
userRouter.post("/unsave/:blogId/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  const blogId = c.req.param("blogId");
  try {
    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          saved: {
            disconnect: {
              id: blogId,
            },
          },
        },
      }),
      prisma.blog.update({
        where: {
          id: blogId,
        },
        data: {
          savedBy: {
            disconnect: {
              id: userId,
            },
          },
        },
      }),
    ]);
    c.status(200);
    return c.json({ message: "Blog unsaved" });
  } catch (error) {
    c.status(400);
    throw new Error("Couldn't unsave the blog");
  }
});

// @desc Like a blog
// @route POST /api/v1/user/like/:blogId
// @access Private
userRouter.post("/like/:blogId/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  const blogId = c.req.param("blogId");
  try {
    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          likes: {
            connect: {
              id: blogId,
            },
          },
        },
      }),
      prisma.blog.update({
        where: {
          id: blogId,
        },
        data: {
          likedBy: {
            connect: {
              id: userId,
            },
          },
        },
      }),
    ]);
    c.status(200);
    return c.json({ message: "Blog liked" });
  } catch (error) {
    c.status(400);
    throw new Error("Couldn't like the blog");
  }
});

// @desc Unlike a blog
// @route POST /api/v1/user/unlike/:blogId/
// @access Private
userRouter.post("/unlike/:blogId/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  const blogId = c.req.param("blogId");
  try {
    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          likes: {
            disconnect: {
              id: blogId,
            },
          },
        },
      }),
      prisma.blog.update({
        where: {
          id: blogId,
        },
        data: {
          likedBy: {
            disconnect: {
              id: userId,
            },
          },
        },
      }),
    ]);
    c.status(200);
    return c.json({ message: "Blog unliked" });
  } catch (error) {
    c.status(400);
    throw new Error("Couldn't unlike the blog");
  }
});

// @desc A blog is liked by a user or not
// @route GET /api/v1/user/like/:blogId
// @access Private
userRouter.get("/like/:blogId/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  const blogId = c.req.param("blogId");
  try {
    const liked = await prisma.user.findFirst({
      where: {
        id: userId,
        likes: {
          some: {
            id: blogId,
          },
        },
      },
    });
    c.status(200);
    return c.json({ liked: !!liked });
  } catch (error) {
    c.status(400);
    throw new Error("Couldn't get the like status");
  }
});

// @desc A blog is saved by a user or not
// @route GET /api/v1/user/save/:blogId
// @access Private
userRouter.get("/save/:blogId/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  const blogId = c.req.param("blogId");
  try {
    const saved = await prisma.user.findFirst({
      where: {
        id: userId,
        saved: {
          some: {
            id: blogId,
          },
        },
      },
    });
    c.status(200);
    return c.json({ saved: !!saved });
  } catch (error) {
    c.status(400);
    throw new Error("Couldn't get the like status");
  }
});

export default userRouter;
