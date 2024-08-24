import {IO} from "fp-ts/lib/IO";
import {Reader} from "fp-ts/lib/Reader";
import {SocketEvent} from "./SocketEvent";
import {TranscriberEvent} from "./TranscriberEvent";

export type EventMap = {
  [SocketEvent.Connect]: IO<void>;
  [SocketEvent.Disconnect]: IO<void>;
  [SocketEvent.ConnectionError]: IO<void>;
  [SocketEvent.Error]: Reader<string, void>;
  [TranscriberEvent.Ready]: IO<void>;
  [TranscriberEvent.FinalTranscript]: Reader<string, void>;
  [TranscriberEvent.PartialTranscript]: Reader<string, void>;
  [TranscriberEvent.Error]: Reader<string, void>;
  [TranscriberEvent.Closed]: IO<void>;
};
