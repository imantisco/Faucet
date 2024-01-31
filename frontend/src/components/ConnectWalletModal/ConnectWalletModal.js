import * as React from "react";
import clsx from "clsx";
import styles from "./ConnectWalletModal.module.scss";

import ConnectWalletDialog from "../ConnectWalletDialog/ConnectWalletDialog";

const Modal = (props) => {
  const { open, onClose } = props;

  const modalClassNames = clsx({
    [styles.modal]: true,
    [styles.active]: open,
  });

  React.useEffect(() => {
    const body = document.querySelector("body");
    if (!body) return;
    if (open) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
  });

  return (
    <div className={modalClassNames}>
      <div className={styles.overlay}>
        <ConnectWalletDialog onClose={onClose} />
      </div>
    </div>
  );
};

export default Modal;
