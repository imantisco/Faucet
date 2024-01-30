import { atom, selector, useRecoilState } from "recoil";

import persistAtom from "./persistAtom";

// src/store/walletInfoStore.js
export const walletInfoRecoilState = atom({
  key: "walletInfo_CVTX_faucet",
  default: {
    chainInfo: {
      netName: process.env.NEXT_PUBLIC_NETWORK_NAME,
      chainId: process.env.NEXT_PUBLIC_HEX_CHAIN_ID,
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
    },
    network: {
      chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
      chainName: process.env.NEXT_PUBLIC_NETWORK_NAME,
      nativeCurrency: {
        name: process.env.NEXT_PUBLIC_NETWORK_NAME,
        symbol: process.env.NEXT_PUBLIC_NETWORK_SYMBOL,
        decimals: 18,
      },
      rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL],
    },
    selectedWallet: null,
  },
  effects_UNSTABLE: [persistAtom],
});

export function useWalletInfoRecoil() {
  const [walletInfoRecoil, setWalletInfoRecoil] = useRecoilState(
    walletInfoRecoilState
  );

  return {
    walletInfoRecoil,
    setWalletInfoRecoil,
  };
}
