"use client";
import {IO} from "fp-ts/lib/IO";
import {SocketEvent, TranscriberEvent} from "@repo/transcriber";
import {TranscriberSocket} from "../lib/TranscriberSocket";
import {useCallback, useState} from "react";
import {useSocketListener} from "./useSocketListener";

export function useSocketErrorHandlers(socket: TranscriberSocket) {
  const [error, setError] = useState<SocketError | undefined>(undefined);

  const onError = useCallback(() => setError(SocketError.UNKNOWN_ERROR), []);
  const onConnect = useCallback(() => setError(undefined), []);
  const onDisconnect = useCallback(
    () => setError(SocketError.CONNECTION_LOST),
    [],
  );

  useSocketListener([
    [SocketEvent.Connect, onConnect],
    [SocketEvent.Disconnect, onDisconnect],
    [SocketEvent.ConnectionError, onDisconnect],
    [TranscriberEvent.Error, onError],
  ]);

  const errorRecoveryStrategy: Record<SocketError, IO<void>> = {
    [SocketError.CONNECTION_LOST]: () => socket.connect(),
    [SocketError.UNKNOWN_ERROR]: () => {},
  };

  return {
    errorRecovery: () => error && errorRecoveryStrategy[error]?.(),
    isSocketError: Boolean(error),
  };
}

enum SocketError {
  CONNECTION_LOST = "Connection lost",
  UNKNOWN_ERROR = "Unknown error",
}
