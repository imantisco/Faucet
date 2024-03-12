import React, { useState, useMemo, useRef, useEffect } from 'react';
import Head from 'next/head';
import { Lexend } from 'next/font/google';
import { ethers } from 'ethers';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from '@/styles/Home.module.css';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import Logo from '@/components/Logo/Logo';

import ConnectButton from '@/components/Button/ConnectButton';
import ConnectWalletModal from '@/components/ConnectWalletModal/ConnectWalletModal';

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--lexend-font',
});

const Home = () => {
  const { account } = useWeb3React();
  const [address, setAddress] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recaptcha, setRecaptcha] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const recaptchaRef = useRef(undefined);
  const animationRef = useRef(null);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleBlur = () => {
    !touched && setTouched(true);
  };

  const isAddressValidate = useMemo(() => {
    const isAddress = ethers.isAddress;
    return isAddress(address);
  }, [address]);

  const reset = () => {
    setTouched(false);
    // setRecaptcha(null);
    // recaptchaRef.current.reset();
  };

  const handleRecaptchaChange = (value) => {
    // setRecaptcha(value);
  };

  const handleSubmit = () => {
    setLoading(true);

    const params = new URLSearchParams();
    params.append('to', address);

    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/faucets`, params)
      .then((response) => {
        console.log(`tx Hash : ${JSON.stringify(response.data.txHash)}`);
        console.log(`status : ${response.data.success}`);
        toast.success(`Faucet Success`, { transition: Zoom });
        reset();
        setLoading(false);
      })
      .catch((err) => {
        console.log(`err : ${JSON.stringify(err)}}`);
        let errText = 'Faucet Fail';
        if (typeof err.response == 'undefined' || err.response == null) {
          errText = 'Unknown status';
        } else {
          switch (err.response.status) {
            case 400:
              errText = 'Invalid request';
              break;
            case 403:
              errText = 'Too many requests';
              break;
            case 404:
              errText = 'Cannot connect to server';
              break;
            case 502:
            case 503:
              errText = 'Faucet service temporary unavailable';
              break;
            default:
              errText = err.response.data || err.message;
              break;
          }
        }
        toast.error(`${errText}`, { transition: Zoom });
        setLoading(false);
      });
  };

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.style.setProperty('transform', 'translateY(-1%)');
      animationRef.current.style.setProperty('opacity', '1');
    }
  }, []);

  useEffect(() => {
    setAddress(account);
  }, [account]);

  return (
    <>
      <Head>
        <title>CarrieVerse Testnet Faucet</title>
        <meta name="description" content="CarrieVerse Testnet Faucet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConnectWalletModal open={modalOpen} onClose={handleCloseModal} />
      <header className={styles.header}>
        <div className={styles.wrapper}>
          <Logo />
          <ConnectButton
            open={modalOpen}
            onClick={handleOpenModal}
            onClose={handleCloseModal}
          />
        </div>
      </header>
      <main className={styles.main}>
        <div
          className={`${styles.center} ${lexend.variable}`}
          ref={animationRef}
        >
          <h1>Testnet Faucet!</h1>
          <p>Enter your wallet address to receive the payment</p>
          <div className={styles.container}>
            <Input
              value={address ?? 'Connect your wallet first'}
              onBlur={handleBlur}
              error={(!address || !isAddressValidate) && touched}
              placeholder={address ? 'CVTX Testnet address' : 'Connect wallet'}
            />
            <Button
              disabled={!address || !isAddressValidate || loading}
              onClick={handleSubmit}
            >
              Send me Tokens
            </Button>
          </div>
          {/* <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY}
            onChange={handleRecaptchaChange}
            ref={recaptchaRef}
          /> */}
        </div>
      </main>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <footer className={styles.footer}>
        <p>© 2024 CarrieVerse. All Rights Reserved</p>
      </footer>
    </>
  );
};

export default Home;
