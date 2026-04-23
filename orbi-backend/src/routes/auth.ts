import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../db.js";
import { signAccessToken } from "../auth/jwt.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const authRouter = Router();

const BCRYPT_ROUNDS = 11;

function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const e = raw.trim().toLowerCase();
  if (!e || e.length > 320) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return e;
}

function normalizePassword(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  if (raw.length < 8 || raw.length > 128) return null;
  return raw;
}

function publicUser(u: { id: string; email: string | null; displayName: string | null }) {
  return { id: u.id, email: u.email, displayName: u.displayName };
}

authRouter.post("/auth/register", async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = normalizePassword(req.body?.password);
  const displayName =
    typeof req.body?.displayName === "string" && req.body.displayName.trim().length > 0
      ? req.body.displayName.trim().slice(0, 80)
      : null;

  if (!email || !password) {
    res.status(400).json({ error: "invalid_email_or_password" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: { email, passwordHash, displayName },
      select: { id: true, email: true, displayName: true },
    });
    const token = signAccessToken(user.id);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "P2002") {
      res.status(409).json({ error: "email_taken" });
      return;
    }
    throw e;
  }
});

authRouter.post("/auth/login", async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = normalizePassword(req.body?.password);
  if (!email || !password) {
    res.status(400).json({ error: "invalid_email_or_password" });
    return;
  }

  const user = await prisma.user.findFirst({
    where: { email, passwordHash: { not: null } },
    select: { id: true, email: true, displayName: true, passwordHash: true },
  });

  if (!user?.passwordHash) {
    res.status(401).json({ error: "invalid_credentials" });
    return;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "invalid_credentials" });
    return;
  }

  const token = signAccessToken(user.id);
  res.json({
    token,
    user: publicUser({ id: user.id, email: user.email, displayName: user.displayName }),
  });
});

authRouter.get("/auth/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, displayName: true },
  });
  if (!user) {
    res.status(401).json({ error: "user_not_found" });
    return;
  }
  res.json({ user: publicUser(user) });
});
