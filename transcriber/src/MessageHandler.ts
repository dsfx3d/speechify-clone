import {Reader} from "fp-ts/lib/Reader";

export type MessageHandler<Payload> = Reader<Payload, void>;
