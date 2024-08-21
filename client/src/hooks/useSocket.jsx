import { SocketEvents } from "@repo/shared";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const url = new URL(window.location.href);
url.port = "8080";
const serverURL = url.toString();

const errors = {
  CONNECTION_LOST: "Connection lost",
  UNKNOWN_ERROR: "Unknown error",
};

const useSocket = () => {
  const [socket] = useState(
    io(serverURL, {
      reconnection: true,
      reconnectionAttempts: 3,
    })
  );
  const [error, setError] = useState(undefined);

  useEffect(() => {
    socket.connect();
  }, [socket]);

  useEffect(() => {
    const onDisconnect = () => setError(errors.CONNECTION_LOST);
    socket.on(SocketEvents.ConnectionError, onDisconnect);
    socket.on(SocketEvents.Disconnect, onDisconnect);
    return () => {
      socket.off(SocketEvents.ConnectionError, onDisconnect);
      socket.off(SocketEvents.Disconnect, onDisconnect);
    };
  });

  useEffect(() => {
    const onConnect = () => setError(undefined);
    socket.on(SocketEvents.Connect, onConnect);
    return () => socket.off(SocketEvents.Connect, onConnect);
  });

  useEffect(() => {
    const onError = () => setError(errors.UNKNOWN_ERROR);
    socket.on(SocketEvents.Error, onError);
    return () => socket.off(SocketEvents.Error, onError);
  }, [socket]);

  const errorRecoveryStrategy = {
    [errors.CONNECTION_LOST]: () => socket.connect(),
    [errors.UNKNOWN_ERROR]: () => {},
  };

  return {
    socket,
    errorRecovery: () => errorRecoveryStrategy[error]?.(),
    isSocketError: Boolean(error),
    canRecover: error !== errors.UNKNOWN_ERROR,
  };
};

export default useSocket;
