import {EventMap, RequestMap} from "@repo/transcriber";
import {Socket} from "socket.io-client";

export type TranscriberSocket = Socket<EventMap, RequestMap>;
