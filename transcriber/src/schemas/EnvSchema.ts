import { z } from "zod";

export const EnvSchema = z.object({
  DEEPGRAM_API_KEY: z.string(),
})
