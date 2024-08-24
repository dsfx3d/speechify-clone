import {useEffect, useState} from "react";

type TProps = {
  transcript: string;
};

export default function CopyButton({transcript}: TProps) {
  const [label, setLabel] = useState("Copy");

  useEffect(() => {
    setLabel("Copy");
  }, [transcript]);

  return (
    <span
      id="copy-button"
      className="pointer"
      onClick={() => {
        navigator.clipboard.writeText(transcript);
        setLabel("Copied");
      }}
    >
      {label}
    </span>
  );
}
