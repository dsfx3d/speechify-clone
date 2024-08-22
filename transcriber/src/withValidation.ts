import { flow } from "fp-ts/lib/function";
import { Socket } from "socket.io";
import { z, ZodObject, ZodRawShape } from "zod";
import { fromPredicate, map, mapLeft } from "fp-ts/lib/Either";
import { TranscriberEvent } from "./TranscriberEvent";

export const withValidation =
  <T extends ZodRawShape>(
    payloadSchema: ZodObject<T>,
    handler: (payload: z.infer<ZodObject<T>>, socket: Socket) => void,
  ) =>
    (socket: Socket) =>
      flow(
        fromPredicate(
          (payload: T) => payloadSchema.safeParse(payload).success,
          (payload: T) => payloadSchema.safeParse(payload).error?.errors ?? []
        ),
        map((payload) => handler(payload, socket)),
        mapLeft((error) => socket.emit(TranscriberEvent.Error, error))
      );
