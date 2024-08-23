import {ConfigSchema} from "./schemas/ConfigSchema";
import {EventMap} from "./EventMap";
import {RequestMap} from "./RequestMap";
import {Server} from "socket.io";
import {SocketEvent} from "./SocketEvent";
import {TranscribeRequestSchema} from "./schemas/TranscribeRequestSchema";
import {Transcriber} from "./Transcriber";
import {TranscriberRequest} from "./TranscriberRequest";
import {createHandler} from "./createHandler";

export const createTranscriptionServer = (
  io: Server<RequestMap, EventMap>,
  transcriber: Transcriber,
): Server => {
  const disconnectTranscriber = () => transcriber.disconnect();
  io.on(SocketEvent.Connect, socket => {
    const handler = createHandler(socket);
    const connectTranscriber = handler(ConfigSchema, config => {
      transcriber.connect(socket, config);
    });
    const transcribe = handler(TranscribeRequestSchema, ({audioChunk}) => {
      transcriber.requestTranscription(audioChunk);
    });
    socket.on(TranscriberRequest.Open, connectTranscriber);
    socket.on(TranscriberRequest.Transcribe, transcribe);
    socket.on(TranscriberRequest.Close, disconnectTranscriber);
    socket.on(SocketEvent.Disconnect, disconnectTranscriber);
  });
  return io;
};
