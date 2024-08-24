import {cn} from "~/lib/utils";

type TProps = {
  children: React.ReactNode;
  transcriber: React.ReactNode;
};

export default function HomeLayout({children, transcriber}: TProps) {
  const style = cn([
    "flex flex-col items-center justify-center min-h-screen min-w-screen",
  ]);
  return (
    <main className={style}>
      {children}
      {transcriber}
    </main>
  );
}
