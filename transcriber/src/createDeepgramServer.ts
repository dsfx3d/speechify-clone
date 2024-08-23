import {EventMap} from "./EventMap";
import {RequestMap} from "./RequestMap";
import {Server} from "socket.io";
import {Transcriber} from "./Transcriber";
import {createClient} from "@deepgram/sdk";
import {createTranscriptionServer} from "./createTranscriptionServer";

export function createDeepgramServer(
  io: Server<RequestMap, EventMap>,
  deepgramApiKey: string,
): Server {
  const client = createClient(deepgramApiKey);
  const transcriber = new Transcriber(client);
  return createTranscriptionServer(io, transcriber);
}
