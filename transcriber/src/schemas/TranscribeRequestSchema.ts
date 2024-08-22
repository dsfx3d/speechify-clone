import { z } from "zod";

export const TranscribeRequestSchema = z.object({
  audioChunk: z.instanceof(Buffer),
});
