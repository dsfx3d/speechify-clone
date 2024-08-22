import { EnvSchema } from "./schemas/EnvSchema";

export const env = EnvSchema.parse(process.env);
