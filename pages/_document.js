import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className=" overflow-y-scroll scrollbar-thumb-zinc-700 scrollbar-thumb-rounded-2xl scrollbar-track-latte scrollbar-thin">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
