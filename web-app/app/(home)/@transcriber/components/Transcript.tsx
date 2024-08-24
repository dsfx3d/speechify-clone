import {Textarea} from "~/components/ui/textarea";
import {useTranscript} from "../hooks/useTranscript";

export function Transcript() {
  const [transcript, setTranscript] = useTranscript();

  return (
    <Textarea
      id="transcript"
      className="placeholder:hover:opacity-80"
      placeholder='Type or press "Tap to speak". Your speech will be transcribed here.'
      value={transcript}
      onChange={e => setTranscript(e.target.value)}
    />
  );
}
