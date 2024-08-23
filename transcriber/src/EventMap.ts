import {IO} from "fp-ts/lib/IO";
import {Reader} from "fp-ts/lib/Reader";
import {TranscriberEvent} from "./TranscriberEvent";

export type EventMap = {
  [TranscriberEvent.Ready]: IO<void>;
  [TranscriberEvent.FinalTranscript]: Reader<string, void>;
  [TranscriberEvent.PartialTranscript]: Reader<string, void>;
  [TranscriberEvent.Error]: Reader<string, void>;
  [TranscriberEvent.Closed]: IO<void>;
};
