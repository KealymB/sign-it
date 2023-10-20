import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Head from "next/head";
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <meta name="theme-color" content="#2e026d" />
        <meta name="msapplication-navbutton-color" content="#2e026d" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#2e026d" />
      </Head>
      <Component {...pageProps} />
      <ToastContainer />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
