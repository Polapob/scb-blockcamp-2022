import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";
import Notification from "../src/components/Notification/Notification";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { injectedConnector } from "../src/utils/Provider";
import Navbar from "../src/components/Navbar";
import AccountDetails from "../src/components/AccountDetails";
import { useNotification } from "../src/context/NotificationContext";

const ConnectWallet = () => {
  const { chainId, account, activate, active, library } = useWeb3React<Web3Provider>();
  const onClick = () => {
    activate(injectedConnector);
  };

  useEffect(() => {
    console.log(chainId, account, active);
  });

  return (
    <div>
      <div>ChainId: {chainId}</div>
      <div>Account: {account}</div>
      {active ? (
        <div>✅ </div>
      ) : (
        <button type="button" onClick={onClick}>
          Connect
        </button>
      )}
    </div>
  );
};

const Home: NextPage = () => {
  const { chainId, account, activate, active, library } = useWeb3React<Web3Provider>();
  const { addNotification, notifications } = useNotification();
  console.log(notifications);
  const handleOnClick = () => {
    activate(injectedConnector);
    localStorage.setItem("isWalletConnected", "true");
  };

  useEffect(() => {
    const connectWalletOnLoad = async () => {
      if (localStorage.getItem("isWalletConnected") === "true") {
        try {
          activate(injectedConnector);
          localStorage.setItem("isWalletConnected", "true");
        } catch (err) {
          console.log(err);
        }
      }
    };
    connectWalletOnLoad();
  }, [activate]);

  useEffect(() => {
    const timer = setInterval(() => {
      addNotification("Transfer Success!", "success", 1);
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, [addNotification]);

  // console.log(notifications);

  return (
    <div
      style={{
        width: "100%",
        padding: "2rem",
      }}
    >
      <Navbar handleOnClick={handleOnClick} />
      <AccountDetails />
    </div>
  );
};

export default Home;
