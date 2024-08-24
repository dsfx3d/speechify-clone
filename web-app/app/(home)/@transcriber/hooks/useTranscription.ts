"use client";
import {
  SocketEvent,
  TranscriberEvent,
  TranscriberRequest,
} from "@repo/transcriber";
import {TranscriberSocket} from "../lib/TranscriberSocket";
import {useSocketListener} from "./useSocketListener";
import {useTranscriptionStream} from "./useTranscriptionStream";
import useAudioRecorder from "./useAudioRecorder";

export function useTranscription(socket: TranscriberSocket) {
  const {isConnecting, isStreaming, startStream, stopStream} =
    useTranscriptionStream(socket);

  const {isRecording, startRecording, stopRecording} = useAudioRecorder({
    dataCb: (audioChunk: Int16Array) => {
      socket.emit(TranscriberRequest.Transcribe, {
        audioChunk: audioChunk as unknown as Buffer,
      });
    },
  });

  useSocketListener([
    [TranscriberEvent.Closed, stopRecording],
    [TranscriberEvent.Error, stopRecording],
    [SocketEvent.Disconnect, stopRecording],
  ]);

  return {
    isConnecting,
    isTranscribing: isStreaming && isRecording,
    toggleTranscription: async () => {
      isStreaming ? stopStream() : startStream(await startRecording());
    },
  };
}
