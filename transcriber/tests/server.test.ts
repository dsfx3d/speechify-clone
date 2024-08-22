import io, { Socket as ClientSocket } from "socket.io-client";
import { createTranscriptionServer } from "../src/createTranscriptionServer";
import { Server, Socket } from "socket.io";
import { createServer } from "node:http";
import { Transcriber } from "../src/Transcriber";
import wav from "wav";
import fs from "fs";
import "dotenv/config";
import { TranscriberEvent } from "../src/TranscriberEvent";
import { TranscriberRequest } from "../src/TranscriberRequest";
import { env } from "../src/env";
import { createDeepgramServer } from "../src/createDeepgramServer";

const sleep = (timeMS: number) => new Promise((resolve) => setTimeout(resolve, timeMS));

describe("Server", () => {
  let clientSocket: ClientSocket;
  let s: Server;

  beforeAll((done) => {
    const httpServer = createServer();
    s = new Server(httpServer);
    createDeepgramServer(s, env.DEEPGRAM_API_KEY);
    httpServer.listen(8080, done);
  });

  beforeEach((done) => {
    jest.spyOn(console, "warn").mockImplementation(() => { });
    clientSocket = io(`http://localhost:8080`);
    clientSocket.on("connect", done);
  });

  afterAll((done) => {
    clientSocket?.disconnect();
    s.close(() => {
      done();
    });
  });

  afterEach(() => {
    clientSocket?.disconnect();
  });

  it("establishes WebSocket connection", async () => {
    expect(clientSocket.connected).toBe(true);
  });

  it("transcriber can be invoked", (done) => {
    clientSocket.on(TranscriberEvent.Ready, () => done());
    clientSocket.emit(TranscriberRequest.Open, { sampleRate: 24000 });
  });

  it("test final transcript is sent", (done) => {
    clientSocket.on(TranscriberEvent.FinalTranscript, (data) => {
      expect(data).toBeDefined();
      done();
    });

    const wavFile = "./tests/sample.wav";
    const wavReader = new wav.Reader();
    clientSocket.on(TranscriberEvent.Ready, () => {
      fs.createReadStream(wavFile).pipe(wavReader);
      wavReader.on("data", (audioChunk) => {
        clientSocket.emit(TranscriberRequest.Transcribe, { audioChunk });
      });
    });

    clientSocket.emit(TranscriberRequest.Open, { sampleRate: 8000 });
  });

  it("data is passed through", (done) => {
    const sendMock = jest.spyOn(Transcriber.prototype, "requestTranscription");
    clientSocket.on(TranscriberEvent.Ready, async () => {
      const audioChunk = new Float32Array([0.1, 0.2, 0.3]);
      clientSocket.emit(TranscriberRequest.Transcribe, { audioChunk });

      await sleep(200);
      expect(sendMock).toHaveBeenCalled();
      done();
    });
    clientSocket.emit(TranscriberRequest.Open, { sampleRate: 16000 });
  });

  it("test partial transcript is sent", (done) => {
    clientSocket.on(TranscriberEvent.PartialTranscript, (data) => {
      expect(data).toBeDefined();
      done();
    });

    const wavFile = "./tests/sample.wav";
    const wavReader = new wav.Reader();
    clientSocket.on(TranscriberEvent.Ready, () => {
      fs.createReadStream(wavFile).pipe(wavReader);
      wavReader.on("data", (audioChunk) => {
        clientSocket.emit(TranscriberRequest.Transcribe, { audioChunk });
      });
    });

    clientSocket.emit(TranscriberRequest.Open, { sampleRate: 8000 });
  });

  it(`should end the transcription stream when '${TranscriberRequest.Close}' event is received`, async () => {
    const endTranscriptionStreamMock = jest.spyOn(
      Transcriber.prototype,
      "disconnect"
    );
    clientSocket.emit(TranscriberRequest.Close);

    await sleep(200);
    expect(endTranscriptionStreamMock).toHaveBeenCalled();
  });

  it("should end the transcription stream when client disconnects", async () => {
    const endTranscriptionStreamMock = jest.spyOn(
      Transcriber.prototype,
      "disconnect"
    );
    clientSocket.disconnect();
    await sleep(400);
    expect(endTranscriptionStreamMock).toHaveBeenCalled();
  });

  it("test transcriber not invoked from invalid input", async () => {
    const startMock = jest.spyOn(
      Transcriber.prototype,
      "connect"
    );

    clientSocket.emit(TranscriberRequest.Open, "");
    await sleep(200);
    expect(startMock).not.toHaveBeenCalled();
  });

  it("test error sent from invalid input", (done) => {
    clientSocket.on(TranscriberEvent.Error, () => {
      done();
    });

    clientSocket.emit(TranscriberRequest.Open, "");
  });
});
