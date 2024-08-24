import {TranscriberSocket} from "../lib/TranscriberSocket";
import {atom} from "jotai";
import {env} from "~/env/client";
import {io} from "socket.io-client";

const socket = atom(
  io(env.NEXT_PUBLIC_TRANSCRIPTION_API_URL, {
    reconnection: true,
    reconnectionAttempts: 3,
  }) as TranscriberSocket,
);

export const socketAtom = atom(get => get(socket));
