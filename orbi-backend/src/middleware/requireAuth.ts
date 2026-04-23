import type { RequestHandler } from "express";
import { verifyAccessToken } from "../auth/jwt.js";

export const requireAuth: RequestHandler = (req, res, next) => {
  const raw = req.headers.authorization;
  const match = typeof raw === "string" ? raw.match(/^Bearer\s+(.+)$/i) : null;
  const token = match?.[1];
  if (!token) {
    res.status(401).json({ error: "missing_bearer_token" });
    return;
  }
  try {
    const { sub } = verifyAccessToken(token);
    req.userId = sub;
    next();
  } catch {
    res.status(401).json({ error: "invalid_token" });
  }
};
