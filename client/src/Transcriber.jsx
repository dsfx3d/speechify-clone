import IconMic from "./IconMic";
import "./textarea.css";
import { useTranscriptionStream } from "./hooks/useTranscriptionStream";
import useAudioRecorder from "./hooks/useAudioRecorder";
import useSocket from "./hooks/useSocket";
import { useTranscript } from "./hooks/useTranscript";
import IconButton from "./ui/IconButton";
import { useEffect } from "react";
import IconAdd from "./ui/IconAdd";
import CopyButton from "./ui/CopyButton";

export default function Transcriber() {
  const { socket, isSocketError, errorRecovery, canRecover } = useSocket();
  const [transcript, setTranscript] = useTranscript(socket);
  const {
    isInitialized,
    initializeStream,
    enableTranscription,
    sendAudioChunks,
  } = useTranscriptionStream(socket);
  const {
    startRecording,
    isRecording,
    stopRecording,
    isPaused,
    togglePauseResume,
  } = useAudioRecorder({
    dataCb: sendAudioChunks,
  });

  const toggleTranscription = () => {
    [
      [isSocketError, errorRecovery],
      [!isInitialized, async () => initializeStream(await startRecording())],
      [true, () => togglePauseResume()],
    ].find(([condition]) => condition)?.[1]();
  };

  useEffect(() => {
    enableTranscription(isRecording && !isPaused);
  }, [isRecording, enableTranscription, isPaused]);

  useEffect(() => {
    if (isSocketError && isRecording) {
      stopRecording();
    }
  }, [isSocketError, isRecording, stopRecording]);

  const [micButtonVariant] = [
    ["error", isSocketError],
    ["active", isRecording && !isPaused],
    ["inactive", true],
  ].find(([, condition]) => condition);

  const [hint] = [
    ["Connection lost. Tap to try again...", isSocketError && canRecover],
    ["Please try again later...", isSocketError && !canRecover],
    ["Tap to pause", isRecording && !isPaused],
    ["Tap to speak", true],
  ].find(([, condition]) => condition);

  return (
    <div className="transcriber">
      <div className="controls">
        <div id="record-button" onClick={toggleTranscription}>
          <IconButton variant={micButtonVariant}>
            <IconMic />
          </IconButton>
          {hint}
        </div>
      </div>
      <div className="content-panel">
        <div className="sidebar">
          <IconButton
            id="reset-button"
            variant="muted"
            onClick={() => setTranscript("")}
          >
            <IconAdd />
          </IconButton>
        </div>
        <div className="content">
          <textarea
            id="transcription-display"
            placeholder='Type or press "Tap to speak". Your speech will be transcribed here.'
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
          <div className="footer">
            <CopyButton transcript={transcript} />
          </div>
        </div>
      </div>
    </div>
  );
}
