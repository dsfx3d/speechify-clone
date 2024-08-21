import { createClient } from "@deepgram/sdk";
import Transcriber from "./transcriber.js";
import { SocketEvents } from "@repo/shared";
import { validateTranscriptionStreamConfig } from "@repo/shared/validators.js";

const initializeWebSocket = (io) => {
  io.on(SocketEvents.Connection, (socket) => {
    const deepGramClient = createClient(process.env.DEEPGRAM_API_KEY);
    const transcriber = new Transcriber(deepGramClient, socket);

    for (const event of [SocketEvents.StopStream, SocketEvents.Disconnect]) {
      socket.on(event, () => transcriber.endTranscriptionStream());
    }

    socket.on(SocketEvents.ConfigureStream, (config) => {
      const isValidConfig = validateTranscriptionStreamConfig(config);
      if (isValidConfig) {
        transcriber.startTranscriptionStream(config.sampleRate);
      } else {
        socket.emit(SocketEvents.Error, "Invalid sample rate");
      }
    });

    transcriber.on(SocketEvents.TranscriberReady, () => {
      socket.emit(SocketEvents.TranscriberReady);
      socket.on(SocketEvents.IncomingAudio, (audioChunk) => {
        transcriber.send(audioChunk);
      });
    });
  });
  return io;
};

export default initializeWebSocket;
