import * as React from "react";

import {cn} from "~/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          "flex w-full h-full min-h-[40vh]",
          "border-none border-input bg-transparent p-0",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "text-xl",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export {Textarea};
