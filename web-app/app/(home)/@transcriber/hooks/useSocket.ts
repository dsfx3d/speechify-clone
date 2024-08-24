"use client";
import {socketAtom} from "../store/socketAtom";
import {useAtom} from "jotai";
import {useEffect} from "react";

export const useSocket = () => {
  const [socket] = useAtom(socketAtom);
  useEffect(() => {
    socket.connect();
  }, [socket]);
  return [socket];
};
