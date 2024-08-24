import {ComponentProps} from "react";

type TProps = ComponentProps<"svg">;

export default function IconAdd(props: TProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="2rem"
      width="2rem"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M256 176v160M336 256H176"
      />
    </svg>
  );
}
