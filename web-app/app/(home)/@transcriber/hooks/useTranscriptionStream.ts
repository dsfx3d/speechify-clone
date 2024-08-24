"use client";
import {
  SocketEvent,
  TranscriberEvent,
  TranscriberRequest,
} from "@repo/transcriber";
import {TranscriberSocket} from "../lib/TranscriberSocket";
import {useEffect, useState} from "react";
import {useSocketListener} from "./useSocketListener";

export function useTranscriptionStream(socket: TranscriberSocket) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sampleRate, setSampleRate] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (sampleRate !== undefined) {
      socket.emit(TranscriberRequest.Open, {sampleRate});
      setIsConnecting(true);
    }
    return () => {
      socket.emit(TranscriberRequest.Close);
    };
  }, [socket, sampleRate]);

  useEffect(() => {
    !isStreaming && setSampleRate(undefined);
  }, [isStreaming]);

  useSocketListener([
    [
      TranscriberEvent.Ready,
      () => {
        setIsStreaming(true);
        setIsConnecting(false);
      },
    ],
    [TranscriberEvent.Closed, () => setIsStreaming(false)],
    [TranscriberEvent.Error, () => setIsStreaming(false)],
    [SocketEvent.Disconnect, () => setIsStreaming(false)],
  ]);

  return {
    isConnecting,
    isStreaming,
    // TODO: add validation for sampleRate
    startStream: setSampleRate,
    stopStream: () => setIsStreaming(false),
  };
}
