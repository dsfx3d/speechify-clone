import {EventMap} from "./EventMap";
import {RequestMap} from "./RequestMap";
import {Socket} from "socket.io";

export type TranscriberSocket = Socket<RequestMap, EventMap>;
