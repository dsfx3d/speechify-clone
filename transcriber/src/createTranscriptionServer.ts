import { SocketEvent } from "./SocketEvent";
import { Server, Socket } from "socket.io";
import { TranscriberRequest } from "./TranscriberRequest";
import { createMessageHandlers } from "./createMessageHandlers";
import { Transcriber } from "./Transcriber";

export const createTranscriptionServer = (
  io: Server,
  transcriber: Transcriber,
): Server => {
  const {
    connectTranscriber,
    transcribe,
    disconnectTranscriber,
  } = createMessageHandlers(transcriber);
  io.on(SocketEvent.Connect, (socket: Socket) => {
    socket.on(TranscriberRequest.Open, connectTranscriber(socket));
    socket.on(TranscriberRequest.Transcribe, transcribe(socket));
    socket.on(TranscriberRequest.Close, disconnectTranscriber);
    socket.on(SocketEvent.Disconnect, disconnectTranscriber);
  });
  return io;
};
