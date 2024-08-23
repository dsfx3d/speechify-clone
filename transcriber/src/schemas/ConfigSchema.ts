import {z} from "zod";

export const ConfigSchema = z.object({
  sampleRate: z.number(),
});
