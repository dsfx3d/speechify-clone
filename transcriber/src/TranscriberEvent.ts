export enum TranscriberEvent {
  Ready = "transcriber:ready",
  FinalTranscript = "transcriber:final",
  PartialTranscript = "transcriber:partial",
  Error = "transcriber:error",
  Closed = "transcriber:closed",
}
