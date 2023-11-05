import type { AppProps } from "next/app";
import React from "react";
import Layout from "../container/Layout";

import "../styles/globals.css";

// Next Auth
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }: AppProps) {
  const { session } = pageProps;
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
