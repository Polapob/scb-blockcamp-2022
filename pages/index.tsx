import type { NextPage } from "next";
import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { injectedConnector } from "../src/utils/Provider";
import Navbar from "../src/components/Navbar";
import AccountDetails from "../src/components/AccountDetails";

const Home: NextPage = () => {
  const { chainId, account, activate, active, library } = useWeb3React<Web3Provider>();
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
        } catch (err) {}
      }
    };
    connectWalletOnLoad();
  }, [activate]);

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
