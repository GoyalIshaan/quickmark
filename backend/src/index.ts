import { Hono } from "hono";
import userRouter from "./routes/userRouter";
import blogRouter from "./routes/blogRouter";
import commentRouter from "./routes/commentsRouter";
import { cors } from "hono/cors";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.use("/*", cors());
app.route("/api/v1/user/", userRouter);
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/comment/", commentRouter);

export default app;
