/**
 * - transcriber-ready: Emitted when the transcriber is ready.
 * - final: Emits the final transcription result (string).
 * - partial: Emits the partial transcription result (string).
 * - error: Emitted when an error occurs.
 * - connection: Triggered when a client connects to the server.
 * - configure-stream: Requires an object with a 'sampleRate' property.
 * - incoming-audio: Requires audio data as the parameter.
 * - stop-stream: Triggered when the client requests to stop the transcription stream.
 * - disconnect: Triggered when a client disconnects from the server.
 * - connection_error: Triggered when an error occurs.
 * - connect: Triggered when a client connects to the server.
 */
export const SocketEvents = {
  TranscriberReady: "transcriber-ready",
  Final: "final",
  Partial: "partial",
  Error: "error",
  Connection: "connection",
  ConfigureStream: "configure-stream",
  IncomingAudio: "incoming-audio",
  StopStream: "stop-stream",
  Disconnect: "disconnect",
  ConnectionError: "connection_error",
  Connect: "connect",
}