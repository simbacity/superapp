import { IS_PRODUCTION } from "@app-store/shared/utils/config/constants";
import { trpc } from "@app-store/shared/utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import type { AppProps, AppType } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";

import { SocketProvider } from "@components/SocketProvider";

import "../styles/globals.css";

interface InstallAppPromptEvent extends Event {
  prompt: () => void;
}

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  const [installAppPromptEvent, setInstallAppPromptEvent] = useState<InstallAppPromptEvent | null>(null);

  useEffect(() => {
    if (!window) return;

    const stashAddToHomeScreenPrompt = (event: Event) => {
      event.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallAppPromptEvent(event as InstallAppPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", stashAddToHomeScreenPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", stashAddToHomeScreenPrompt);
    };
  }, []);

  const triggerInstallAppPrompt = () => {
    if (setInstallAppPromptEvent) {
      (installAppPromptEvent as InstallAppPromptEvent).prompt();
      setInstallAppPromptEvent(null);
    }
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      {installAppPromptEvent && (
        <div className="flex w-full bg-indigo-600 text-white items-center px-4 py-4 justify-between md:hidden">
          <div>
            <div className="text-sm font-medium">Simba City</div>
            <div className="text-xs font-normal">Install the superapp.</div>
          </div>
          <a
            onClick={() => triggerInstallAppPrompt()}
            className="bg-white py-2 px-6 rounded-full text-indigo-600 font-semibold text-sm cursor-pointer">
            Install
          </a>
        </div>
      )}
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <SocketProvider>
            <Component {...pageProps} />
          </SocketProvider>
        </SessionProvider>
        {!IS_PRODUCTION && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
