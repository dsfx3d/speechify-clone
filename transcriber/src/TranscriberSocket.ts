import { Socket } from "socket.io";
import { RequestMap } from "./RequestMap";
import { EventMap } from "./EventMap";

export type TranscriberSocket = Socket<RequestMap, EventMap>;
