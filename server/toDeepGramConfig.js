export function toDeepGramConfig(sampleRate) {
  return {
    model: "nova-2",
    punctuate: true,
    language: "en",
    diarize: false,
    interim_results: true,
    smart_format: true,
    endpointing: 0,
    encoding: "linear16",
    sample_rate: sampleRate,
  }
}