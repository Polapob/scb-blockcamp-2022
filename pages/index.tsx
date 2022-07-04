import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";

import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { injectedConnector } from "../src/utils/Provider";
import Navbar from "../src/components/Navbar";
import AccountDetails from "../src/components/AccountDetails";

const ConnectWallet = () => {
  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();
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
  return (
    <div
      style={{
        width: "100%",
        padding: "2rem",
      }}
    >
      <Navbar />
      <AccountDetails />
    </div>
  );
};

export default Home;
