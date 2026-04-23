/** IPFS / Arweave: pin file → return CID + optional content hash. Wire Pinata / NFT.Storage here. */
export const media = {
  async uploadPlaceholder(_file: Buffer, _mime: string): Promise<{ cid: string; hash: string }> {
    throw Object.assign(new Error("media_not_configured"), { code: "MEDIA_NOT_CONFIGURED" });
  },
};
