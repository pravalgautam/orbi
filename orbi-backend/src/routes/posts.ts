import { Router } from "express";
import { prisma } from "../db.js";
import { moderation } from "../services/moderation.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const postsRouter = Router();

postsRouter.post("/posts", requireAuth, async (req, res) => {
  try {
    const body = typeof req.body?.body === "string" ? req.body.body : null;
    const authorId = req.userId!;
    moderation.assertPostAllowed({ body, authorId });
    const post = await prisma.post.create({
      data: { authorId, body },
    });
    res.status(201).json(post);
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "EMPTY_POST" || err.code === "POST_TOO_LONG") {
      res.status(400).json({ error: err.code });
      return;
    }
    throw e;
  }
});

postsRouter.get("/posts", async (_req, res) => {
  const posts = await prisma.post.findMany({
    where: { hidden: false },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { author: { select: { id: true, displayName: true } } },
  });
  res.json(posts);
});
