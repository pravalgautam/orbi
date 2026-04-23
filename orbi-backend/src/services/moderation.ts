/** Day-one spam / abuse gates — expand with rate limits, ML, report queue. */
export const moderation = {
  assertPostAllowed(input: { body: string | null; authorId: string }) {
    const text = (input.body ?? "").trim();
    if (text.length > 8000) {
      throw Object.assign(new Error("post_too_long"), { code: "POST_TOO_LONG" });
    }
    if (text.length === 0) {
      throw Object.assign(new Error("empty_post"), { code: "EMPTY_POST" });
    }
    // TODO: URL allowlist, regex spam, duplicate detection, user reputation
  },
} satisfies {
  assertPostAllowed: (input: { body: string | null; authorId: string }) => void;
};
