"use client";
/* eslint-disable unicorn/no-for-loop */
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type TProps = {
  dataCb?: (data: Int16Array) => void;
};

const float32To16BitPCM = (float32Arr: Float32Array) => {
  const pcm16bit = new Int16Array(float32Arr.length);
  for (let i = 0; i < float32Arr.length; i++) {
    // force number in [-1,1]
    const s = Math.max(-1, Math.min(1, float32Arr[i]));

    /**
     * convert 32 bit float to 16 bit int pcm audio
     * 0x8000 = minimum int16 value, 0x7fff = maximum int16 value
     */
    pcm16bit[i] = s < 0 ? s * 0x80_00 : s * 0x7f_ff;
  }
  return pcm16bit;
};

// eslint-disable-next-line max-statements
const useAudioRecorder = ({dataCb}: TProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [, setRecordingTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder>();
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout>();
  const sourceNode = useRef<MediaStreamAudioSourceNode>();
  const scriptProcessor = useRef<ScriptProcessorNode>();
  const audioContext = useRef<AudioContext>() as MutableRefObject<AudioContext>;

  useEffect(() => {
    audioContext.current = new AudioContext();
  }, []);

  const _startTimer = useCallback(() => {
    const tick = () => setRecordingTime(time => time + 1);
    const interval = setInterval(tick, 1000);
    setTimerInterval(interval);
  }, [setRecordingTime, setTimerInterval]);

  const _stopTimer = useCallback(() => {
    timerInterval !== undefined && clearInterval(timerInterval);
    setTimerInterval(undefined);
  }, [timerInterval, setTimerInterval]);

  // eslint-disable-next-line max-statements
  const startRecording = async () => {
    if (timerInterval !== undefined) {
      throw new Error("timerInterval not null");
    }
    const isTesting = !navigator.mediaDevices;
    if (isTesting) {
      setIsRecording(true);
      return 24_000;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    audioContext.current.resume();
    sourceNode.current = audioContext.current.createMediaStreamSource(stream);

    const chunkSize = 4096;
    scriptProcessor.current = audioContext.current.createScriptProcessor(
      chunkSize,
      1,
      1,
    );

    scriptProcessor.current.onaudioprocess = event => {
      const inputBuffer = event.inputBuffer;
      const float32Audio = inputBuffer.getChannelData(0);
      const pcm16Audio = float32To16BitPCM(float32Audio);
      if (dataCb) {
        dataCb(pcm16Audio);
      }
    };

    sourceNode.current.connect(scriptProcessor.current);
    scriptProcessor.current.connect(audioContext.current.destination);

    setIsRecording(true);
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.start();
    _startTimer();
    return audioContext.current.sampleRate;
  };

  // eslint-disable-next-line max-statements
  const stopRecording = () => {
    scriptProcessor.current?.disconnect();
    sourceNode.current?.disconnect();
    mediaRecorder.current?.stop();
    _stopTimer();
    setRecordingTime(0);
    setIsRecording(false);

    for (const track of mediaRecorder.current?.stream.getTracks() ?? []) {
      track.stop();
    }
  };
  return {
    startRecording,
    stopRecording,
    isRecording,
  };
};

export default useAudioRecorder;
