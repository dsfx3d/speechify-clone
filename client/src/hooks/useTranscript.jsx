import { concatTranscripts } from "@/lib/concatTranscripts";
import { SocketEvents } from "@repo/shared";
import { useEffect, useMemo, useState } from "react";

/**
 * listens to events that returns the transcripted text
 */
export function useTranscript(socket) {
  const [finalTranscript, setFinalTranscript] = useState("");
  const [partialTranscript, setPartialTranscript] = useState("");

  const replacePartialTranscript = ($finalTranscript) => {
    setPartialTranscript("");
    setFinalTranscript((trans) => concatTranscripts(trans, $finalTranscript));
  };

  useEffect(() => {
    const onPartial = (text) => setPartialTranscript(text);
    socket.on(SocketEvents.Partial, onPartial);
    return () => socket.off(SocketEvents.Partial, onPartial);
  }, [socket]);

  useEffect(() => {
    const onFinal = (text) => replacePartialTranscript(text);
    socket.on(SocketEvents.Final, onFinal);
    return () => socket.off(SocketEvents.Final, onFinal);
  }, [socket]);

  const transcript = useMemo(
    () => concatTranscripts(finalTranscript, partialTranscript),
    [partialTranscript, finalTranscript]
  );

  return [transcript, setFinalTranscript];
}
