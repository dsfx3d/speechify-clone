import { flow } from "fp-ts/lib/function";
import { z, ZodIssue, ZodObject, ZodRawShape } from "zod";
import { fold, fromPredicate } from "fp-ts/lib/Either";
import { MessageHandler } from "./MessageHandler";

export const createHandler = (onError: MessageHandler<ZodIssue[]>) =>
  <T extends ZodRawShape>(
    payloadSchema: ZodObject<T>,
    handler: MessageHandler<z.infer<ZodObject<T>>>,
  ): MessageHandler<z.infer<ZodObject<T>>> =>
  flow(
    fromPredicate(
      (payload) => payloadSchema.safeParse(payload).success,
      (payload) => payloadSchema.safeParse(payload).error?.errors ?? [],
    ),
    fold(onError, handler),
  );
