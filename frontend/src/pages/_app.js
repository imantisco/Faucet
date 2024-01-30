import * as React from "react";
import "@/styles/globals.css";
import { Web3ReactProvider } from "@web3-react/core";
import { useWeb3React } from "@web3-react/core";
import { RecoilRoot } from "recoil";

import RootLayout from "@/layout/RootLayout";

import {
  hooks as metaMaskHooks,
  metaMask,
} from "@/lib/connectors/metamask/metamask";

const connectors = [[metaMask, metaMaskHooks]];

export default function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Web3ReactProvider connectors={connectors}>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </Web3ReactProvider>
    </RecoilRoot>
  );
}
