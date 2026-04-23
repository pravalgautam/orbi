import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export function assertJwtSecret(): string {
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be set to a string of at least 16 characters");
  }
  return secret;
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, assertJwtSecret(), { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): { sub: string } {
  const payload = jwt.verify(token, assertJwtSecret());
  if (typeof payload === "string" || !payload || typeof payload.sub !== "string") {
    throw new Error("invalid_token_payload");
  }
  return { sub: payload.sub };
}
