import { SocketEvents } from "@repo/shared";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * change in sample rate -> triggers event to configure stream
 * on stream ready -> enables sending audio chunks to the stream
 * on closed -> disables sending audio chunks to the stream
 * @param {SocketIOClient.Socket} socket
 */
export function useTranscriptionStream(socket) {
  const [isListening, setIsListening] = useState(false);
  /**
   * using ref along with state because sendAudioChunks looses
   * the reference to the state when passed as a callback to the
   * useAudioRecorder hook
   */
  const isListeningRef = useRef(false);
  const [sampleRate, setSampleRate] = useState(undefined);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    if (sampleRate === undefined) {
      return;
    }
    socket.emit(SocketEvents.ConfigureStream, { sampleRate });
    return () => {
      setIsListening(false);
      socket.emit(SocketEvents.StopStream);
    };
  }, [socket, sampleRate]);

  useEffect(() => {
    const onTranscriberReady = () => setIsListening(true);
    socket.on(SocketEvents.TranscriberReady, onTranscriberReady);
    return () => socket.off(SocketEvents.TranscriberReady, onTranscriberReady);
  }, [socket]);

  return {
    isInitialized: sampleRate !== undefined,
    enableTranscription: (shouldListen) => setIsListening(shouldListen),
    initializeStream: ($sampleRate) => setSampleRate($sampleRate),
    sendAudioChunks: (data) => {
      isListeningRef.current && socket.emit(SocketEvents.IncomingAudio, data);
    },
  };
}
