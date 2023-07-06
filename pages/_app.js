import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import client from "@/lib/apollo";

import Header from "./components/header";

import "@/styles/globals.css";
import { Nunito } from "next/font/google";
const nunito = Nunito({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={client}>
        <main
          className={
            nunito.className +
            " overflow-y-scroll scrollbar-thumb-zinc-700 scrollbar-thumb-rounded-2xl scrollbar-track-latte scrollbar-thin"
          }
        >
          <Header />
          <Component {...pageProps} />
        </main>
      </ApolloProvider>
    </SessionProvider>
  );
}
