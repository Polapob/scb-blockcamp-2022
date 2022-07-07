import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "../src/utils/Provider";
import NotificationProvider from "../src/context/NotificationContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
