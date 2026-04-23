import "dotenv/config";
import express from "express";
import { assertJwtSecret } from "./auth/jwt.js";
import { healthRouter } from "./routes/health.js";
import { authRouter } from "./routes/auth.js";
import { postsRouter } from "./routes/posts.js";

assertJwtSecret();

const app = express();
app.use(express.json({ limit: "2mb" }));

app.use(healthRouter);
app.use(authRouter);
app.use(postsRouter);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`orbi-backend listening on :${port}`);
});
