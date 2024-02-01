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
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const ConnectButton = ({ open, onClick }) => {
  const { account, connector } = useWeb3React();

  if (account !== undefined) {
    console.log(`wallet Address: ${account}`);
  }

  const [ethereum, setEthereum] = React.useState({});
  const [hasMetaMask, setHasMetaMask] = React.useState(false);

  const { useIsActive } = metaMaskHooks;
  const isActive = useIsActive();

  const buttonClassNames = clsx({
    [styles.button]: true,
    [styles.active]: isActive,
  });

  const { setWalletInfoRecoil } = useWalletInfoRecoil();

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
        if (isActive) {
          disconnectMetaMask();
          return;
        }
        onClick();
      }}
    >
      {open && (
        <span className={styles.loading}>
          <LoadingSpinner color={"#47a1ff"} /> connecting...
        </span>
      )}
      {!open && <span>{isActive ? <>Disconnect</> : <>Connect Wallet</>}</span>}
    </div>
  );
};

export default ConnectButton;
