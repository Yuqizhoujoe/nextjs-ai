import type { AppProps } from "next/app";
import React from "react";
import Layout from "../container/Layout";

import "../styles/globals.css";

// Next Auth
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const { session } = pageProps;
  return (
    <>
      <Head>
        <title>JOJO AI Assistant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  );
}

export default MyApp;
