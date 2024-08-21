import "./CopyButton.css";
import { useEffect, useState } from "react";

export default function CopyButton({ transcript }) {
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
