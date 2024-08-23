import {ConfigSchema} from "./schemas/ConfigSchema";
import {
  DeepgramClient,
  ListenLiveClient,
  LiveSchema,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
} from "@deepgram/sdk";
import {TranscriberEvent} from "./TranscriberEvent";
import {TranscriberSocket} from "./TranscriberSocket";
import {z} from "zod";

export class Transcriber {
  private client?: ListenLiveClient;

  constructor(private deepgram: DeepgramClient) {}
  connect(dispatch: TranscriberSocket, config: z.infer<typeof ConfigSchema>) {
    const options = this.toDeepgramConfig(config);
    const client = this.deepgram.listen.live(options);
    const eventHandlers = this.createEventListeners(dispatch);
    for (const [event, listener] of eventHandlers) {
      client.on(event, listener);
    }
    this.client = client;
  }

  requestTranscription(audioChunk: Buffer) {
    this.client?.isConnected() && this.client?.send(audioChunk);
  }

  disconnect() {
    this.client?.isConnected() && this.client?.requestClose();
  }

  private createEventListeners(dispatch: TranscriberSocket) {
    return [
      [
        LiveTranscriptionEvents.Open,
        () => dispatch.emit(TranscriberEvent.Ready),
      ],
      [
        LiveTranscriptionEvents.Transcript,
        (event: LiveTranscriptionEvent) => this.emitTranscript(dispatch, event),
      ],
      [
        LiveTranscriptionEvents.Close,
        () => dispatch.emit(TranscriberEvent.Closed),
      ],
      [
        LiveTranscriptionEvents.Error,
        (err: unknown) => {
          dispatch.emit(TranscriberEvent.Error, `${err}`);
        },
      ],
    ] as const;
  }

  private emitTranscript(
    dispatch: TranscriberSocket,
    event: LiveTranscriptionEvent,
  ) {
    const eventName = this.toTranscriptType(event);
    const transcript = this.toTranscript(event);
    transcript.length > 0 && dispatch.emit(eventName, transcript);
  }

  private toTranscriptType(event: LiveTranscriptionEvent): TranscriberEvent {
    if (event.is_final) {
      return TranscriberEvent.FinalTranscript;
    }
    return TranscriberEvent.PartialTranscript;
  }

  private toTranscript(event: LiveTranscriptionEvent): string {
    const guesses = event.channel.alternatives;
    const [bestGuess] = guesses.sort((a, b) => b.confidence - a.confidence);
    return bestGuess?.transcript ?? "";
  }

  private toDeepgramConfig({
    sampleRate,
  }: z.infer<typeof ConfigSchema>): LiveSchema {
    return {
      model: "nova-2",
      punctuate: true,
      language: "en",
      diarize: false,
      interim_results: true,
      smart_format: true,
      encoding: "linear16",
      sample_rate: sampleRate,
    };
  }
}
