import {MessageHandler} from "./MessageHandler";
import {TranscriberEvent} from "./TranscriberEvent";
import {TranscriberSocket} from "./TranscriberSocket";
import {ZodObject, ZodRawShape, z} from "zod";
import {flatMap, fromPredicate, mapLeft, tryCatchK} from "fp-ts/lib/IOEither";
import {flow} from "fp-ts/lib/function";

export const createHandler =
  (socket: TranscriberSocket) =>
  <T extends ZodRawShape>(
    payloadSchema: ZodObject<T>,
    handler: MessageHandler<z.infer<ZodObject<T>>>,
  ): MessageHandler<z.infer<ZodObject<T>>> =>
    flow(
      fromPredicate(
        payload => payloadSchema.safeParse(payload).success,
        payload => payloadSchema.safeParse(payload).error?.errors ?? [],
      ),
      mapLeft(validationErrors => {
        socket.emit(TranscriberEvent.Error, validationErrors.toString());
      }),
      flatMap(
        tryCatchK(handler, error => {
          socket.emit(TranscriberEvent.Error, `${error}`);
        }),
      ),
      runHandler => runHandler(),
    );
