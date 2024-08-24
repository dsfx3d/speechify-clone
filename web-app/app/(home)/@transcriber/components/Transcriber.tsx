"use client";
import {RecordButton} from "./RecordButton";
import {Transcript} from "./Transcript";
import {cn} from "~/lib/utils";
import {useSocket} from "../hooks/useSocket";

export function Transcriber() {
  const [socket] = useSocket();
  const style = cn([
    "bg-white px-8 py-6 w-full",
    "flex flex-col items-center justify-center",
    "w-screen md:w-[75vw] lg:w-[60vw] xl:w-[50vw]",
    "md:rounded-xl",
  ]);
  return (
    <div className={style}>
      <Transcript />
      <RecordButton socket={socket} />
    </div>
  );
}
