import {ComponentProps} from "react";

type TProps = ComponentProps<"svg">;

function IconMic(props: TProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a3 3 0 013 3v6a3 3 0 01-3 3 3 3 0 01-3-3V5a3 3 0 013-3m7 9c0 3.53-2.61 6.44-6 6.93V21h-2v-3.07c-3.39-.49-6-3.4-6-6.93h2a5 5 0 005 5 5 5 0 005-5h2z" />
    </svg>
  );
}

export default IconMic;
