"use client";
import {EventMap} from "@repo/transcriber";
import {socketAtom} from "../store/socketAtom";
import {useAtom} from "jotai";
import {useEffect} from "react";

export function useSocketListener(
  listeners: [keyof EventMap, EventMap[keyof EventMap]][],
) {
  const [socket] = useAtom(socketAtom);
  useEffect(() => {
    for (const [event, handler] of listeners) {
      socket.on(event, handler as any);
    }
    return () => {
      for (const [event, handler] of listeners) {
        socket.off(event, handler as any);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
}
