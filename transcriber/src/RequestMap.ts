import { MessageHandler } from './MessageHandler';
import { TranscriberRequest } from "./TranscriberRequest";
import { z } from "zod";
import { ConfigSchema } from "./schemas/ConfigSchema";
import { TranscribeRequestSchema } from "./schemas/TranscribeRequestSchema";
import { IO } from "fp-ts/lib/IO";

type Config = z.infer<typeof ConfigSchema>;
type TranscribeRequest = z.infer<typeof TranscribeRequestSchema>;

export type RequestMap = {
  [TranscriberRequest.Open]: MessageHandler<Config>,
  [TranscriberRequest.Transcribe]: MessageHandler<TranscribeRequest>,
  [TranscriberRequest.Close]: IO<void>,
};
