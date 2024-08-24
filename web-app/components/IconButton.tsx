import {ComponentProps} from "react";

type TProps = ComponentProps<"span"> & {
  children: React.ReactNode;
};

export default function IconButton({children, ...props}: TProps) {
  return <span {...props}>{children}</span>;
}
