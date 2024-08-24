"use client";
import {JotaiProvider} from "~/provider/JotaiProvider";
import {Transcriber} from "./components/Transcriber";

export default function TranscriberPage() {
  return (
    <JotaiProvider>
      <Transcriber />
    </JotaiProvider>
  );
}
