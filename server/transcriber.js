import EventEmitter from "events";
import { LiveTranscriptionEvents } from '@deepgram/sdk'
import { SocketEvents } from "@repo/shared";
import { toDeepGramConfig } from "./toDeepGramConfig.js";

class Transcriber extends EventEmitter {
  constructor(deepGramClient, socket) {
    super();
    this._deepGramClient = deepGramClient;
    this._stream = null;
    this._socket = socket;
  }

  startTranscriptionStream(sampleRate) {
    this._stream = this._deepGramClient.listen.live(toDeepGramConfig(sampleRate));
    this._stream.on(LiveTranscriptionEvents.Open, () => {
      this.emit(SocketEvents.TranscriberReady);
      this._keepAlive();
      this._emitTranscriptions();
    });
    this._stream.on(LiveTranscriptionEvents.Error, (err) => {
      this._socket.emit(SocketEvents.Error, err);
    });
  }

  endTranscriptionStream() {
    this._isStreamReady() && this._stream.finish();
  }

  send(data) {
    this._isStreamReady() && this._stream.send(data);
  }

  _isStreamReady() {
    return this._stream?.getReadyState() === 1;
  }

  _keepAlive() {
    const heartBeat = () => this._isStreamReady() && this._stream.keepAlive();
    setInterval(heartBeat, 5000);
  }
  
  _emitTranscriptions() {
    this._stream.on(LiveTranscriptionEvents.Transcript, data => {
      const event = data.is_final
        ? SocketEvents.Final
        : SocketEvents.Partial;
      const transcription = data.channel.alternatives[0].transcript;
      transcription.length > 0 && this._socket.emit(event, transcription);
    });
  }
}

export default Transcriber;
