/**
 * @typedef {Object} TranscriptionStreamConfig
 * @property {number} sampleRate - The sample rate of the audio stream
 */
export const validateTranscriptionStreamConfig = (config) => {
  return !isNaN(config.sampleRate);
}