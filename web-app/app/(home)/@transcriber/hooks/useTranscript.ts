"use client";
import {TranscriberEvent} from "@repo/transcriber";
import {useCallback, useState} from "react";
import {useSocketListener} from "./useSocketListener";

export function useTranscript() {
  const [finalTranscript, setFinalTranscript] = useState("");
  const [partialTranscript, setPartialTranscript] = useState("");

  const replacePartialTranscript = useCallback(($finalTranscript: string) => {
    setPartialTranscript("");
    setFinalTranscript(trans => concatTranscripts(trans, $finalTranscript));
  }, []);

  useSocketListener([
    [TranscriberEvent.PartialTranscript, setPartialTranscript],
    [TranscriberEvent.FinalTranscript, replacePartialTranscript],
  ]);

  return [
    concatTranscripts(finalTranscript, partialTranscript),
    setFinalTranscript,
  ] as const;
}

const concatTranscripts = ($1: string, $2: string) => {
  return [$1, $2].filter(Boolean).join(" ");
};
