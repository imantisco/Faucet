import * as React from "react";
import styles from "./ConnectButton.module.scss";
import clsx from "clsx";

import { has, find } from "lodash";
import { useRecoilState } from "recoil";
import { useWeb3React } from "@web3-react/core";

import {
  hooks as metaMaskHooks,
  metaMask,
} from "@/lib/connectors/metamask/metamask";
import { useWalletInfoRecoil } from "@/store/walletStore";

const ConnectButton = () => {
  const { account, connector } = useWeb3React();

  const [ethereum, setEthereum] = React.useState({});
  const [hasMetaMask, setHasMetaMask] = React.useState(false);

  const { useIsActivating, useIsActive } = metaMaskHooks;
  const isActivating = useIsActivating();
  const isActive = useIsActive();

  const buttonClassNames = clsx({
    [styles.button]: true,
    [styles.active]: isActive,
  });

  const { walletInfoRecoil, setWalletInfoRecoil } = useWalletInfoRecoil();

  const [clicked, setClicked] = React.useState(false);

  const connectMetaMask = () => {
    if (!isActive && !isActivating) {
      metaMask.activate(walletInfoRecoil.network).then(() => {
        setClicked(true);
        setWalletInfoRecoil({
          ...walletInfoRecoil,
          selectedWallet: "MetaMask",
        });
      });
    }
  };

  const disconnectMetaMask = async () => {
    if (connector?.deactivate) {
      void connector.deactivate();
    } else {
      void connector.resetState();
    }
    setWalletInfoRecoil((prev) => ({
      ...prev,
      selectedWallet: null,
    }));
  };

  React.useEffect(() => {
    setEthereum(window.ethereum);
    setHasMetaMask(
      ethereum &&
        (ethereum.isMetaMask ||
          (has(ethereum, "providers") &&
            find(
              ethereum.providers,
              (p) => has(p, "isMetaMask") && p.isMetaMask
            ) !== undefined))
    );
  }, [ethereum]);

  return (
    <div
      className={buttonClassNames}
      onClick={() => {
        if (!isActive) {
          connectMetaMask();
        }
        if (isActive) {
          disconnectMetaMask();
        }
      }}
    >
      {isActive ? <>Disconnect</> : <>Connect Wallet</>}
    </div>
  );
};

export default ConnectButton;
