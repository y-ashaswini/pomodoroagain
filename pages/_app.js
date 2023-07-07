import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import client from "@/lib/apollo";

import Header from "./header";

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
        <main className={nunito.className}>
          <Header />
          <Component {...pageProps} />
        </main>
      </ApolloProvider>
    </SessionProvider>
  );
}
