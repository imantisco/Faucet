import styles from "./ConnectWalletDialog.module.scss";

import { Close } from "../Icons/Close";
import { MetaMask } from "../Icons/MetaMask";
import { Cling } from "../Icons/Cling";

import {
  hooks as metaMaskHooks,
  metaMask,
} from "@/lib/connectors/metamask/metamask";
import { useWalletInfoRecoil } from "@/store/walletStore";

const Dialog = ({ onClose }) => {
  const { walletInfoRecoil, setWalletInfoRecoil } = useWalletInfoRecoil();
  const { useIsActivating, useIsActive } = metaMaskHooks;
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  const connectMetaMask = () => {
    if (!isActive && !isActivating) {
      metaMask.activate(walletInfoRecoil.network).then(() => {
        setWalletInfoRecoil({
          ...walletInfoRecoil,
          selectedWallet: "MetaMask",
        });
        onClose();
      });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div />
        <span>Connect to Wallet</span>
        <button onClick={onClose}>
          <Close />
        </button>
      </div>

      <div className={styles.items}>
        <Button
          title={"MetaMask"}
          icon={<MetaMask />}
          onClick={connectMetaMask}
        />
        <Button title={"Cling"} icon={<Cling />} />
      </div>
    </div>
  );
};

const Button = ({ title, onClick, icon }) => {
  return (
    <button className={styles.item} onClick={onClick}>
      <span>{title}</span>
      <span className={styles.icon}>{icon}</span>
    </button>
  );
};

export default Dialog;
