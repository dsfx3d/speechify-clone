import { createClient } from '@deepgram/sdk';
import { Transcriber } from './Transcriber';
import { withValidation } from './withValidation';
import { ConfigSchema } from './schemas/ConfigSchema';
import { TranscribeRequestSchema } from './schemas/TranscribeRequestSchema';

export function createMessageHandlers(transcriber: Transcriber) {
  return {
    disconnectTranscriber: () => transcriber.disconnect(),
    connectTranscriber: withValidation(
      ConfigSchema,
      (config, socket) => transcriber.connect(socket, config),
    ),
    transcribe: withValidation(
      TranscribeRequestSchema,
      ({ audioChunk }) => {
        transcriber.requestTranscription(audioChunk);
      },
    ),
  };
}
