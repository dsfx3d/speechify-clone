import {Button} from "~/components/ui/button";
import {ComponentProps} from "react";
import {TranscriberSocket} from "../lib/TranscriberSocket";
import {useSocketErrorHandlers} from "../hooks/useSocketErrorHandler";
import {useTranscription} from "../hooks/useTranscription";

type Variant = ComponentProps<typeof Button>["variant"];

type TProps = {
  socket: TranscriberSocket;
};

// eslint-disable-next-line complexity
export function RecordButton({socket}: TProps) {
  const {isSocketError, errorRecovery} = useSocketErrorHandlers(socket);
  const {isConnecting, isTranscribing, toggleTranscription} =
    useTranscription(socket);

  const [variant] = [
    ["active", isConnecting],
    ["destructive", isTranscribing],
    ["default", true],
  ].find(([, isTrue]) => isTrue) as [Variant, boolean];

  return (
    <Button
      id="record-button"
      className="w-14 h-14 rounded-full"
      variant={variant}
      disabled={isConnecting}
      onClick={isSocketError ? errorRecovery : toggleTranscription}
    >
      {isTranscribing && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M17 4h-10a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3 -3v-10a3 3 0 0 0 -3 -3z" />
        </svg>
      )}
      {!isTranscribing && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M19 9a1 1 0 0 1 1 1a8 8 0 0 1 -6.999 7.938l-.001 2.062h3a1 1 0 0 1 0 2h-8a1 1 0 0 1 0 -2h3v-2.062a8 8 0 0 1 -7 -7.938a1 1 0 1 1 2 0a6 6 0 0 0 12 0a1 1 0 0 1 1 -1m-7 -8a4 4 0 0 1 4 4v5a4 4 0 1 1 -8 0v-5a4 4 0 0 1 4 -4" />
        </svg>
      )}
    </Button>
  );
}
