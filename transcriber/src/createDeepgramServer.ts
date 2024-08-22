import { createClient } from '@deepgram/sdk';
import { Transcriber } from "./Transcriber";
import { Server } from 'socket.io';
import { createTranscriptionServer } from './createTranscriptionServer';

export function createDeepgramServer(
  io: Server,
  deepgramApiKey: string,
): Server {
  const client = createClient(deepgramApiKey);
  const transcriber = new Transcriber(client);
  return createTranscriptionServer(io, transcriber);
}
