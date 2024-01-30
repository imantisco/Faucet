import * as React from "react";

import { useWalletInfoRecoil } from "@/store/walletStore";

import { useWeb3React } from "@web3-react/core";
import { metaMask } from "@/lib/connectors/metamask/metamask";

const RootLayout = ({ children }) => {
  const [isSelectedWallet, setIsSelectedWallet] = React.useState(false);
  const { walletInfoRecoil, setWalletInfoRecoil } = useWalletInfoRecoil();

  const { account, provider } = useWeb3React();

  React.useEffect(() => {
    setIsSelectedWallet(!!walletInfoRecoil.selectedWallet);
  }, [walletInfoRecoil.selectedWallet]);

  React.useEffect(() => {
    const { selectedWallet } = walletInfoRecoil;

    if (selectedWallet) {
      switch (selectedWallet) {
        case "MetaMask":
          metaMask.connectEagerly().catch(() => {
            console.debug("?????");
          });
      }
    }
  }, [walletInfoRecoil.selectedWallet]);

  return <div>{children}</div>;
};

export default RootLayout;
