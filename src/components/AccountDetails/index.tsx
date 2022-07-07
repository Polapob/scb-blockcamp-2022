import { Text, Modal, Input, Button } from "@mantine/core";
import { ChangeEventHandler, useCallback, useState, useMemo, useEffect } from "react";
import CreateAccountButton from "../CreateAccountButton";
import debounce from "lodash.debounce";
import Account from "../Account";
import CreateAccountModal from "../Modal/CreateAccountModal";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { BANK_CONTRACT_ADDRESS, DAI_CONTRACT_ADDRESS } from "../../constants/const";
import BEC_20_ABI from "../../constants/bec20Abi.json";
import { bankService } from "../../services/bankService";
import { BigNumber, ethers } from "ethers";
import getContract from "../../utils/contract";
import BANK_ABI from "../../constants/bankAbi.json";
import { daiService } from "../../services/tokenService";

type UserAccountTypes = {
  name: string;
  balance: BigNumber;
};

interface IAccountDetailsProps {}

const AccountDetails = () => {
  const { chainId, account, activate, active, library } = useWeb3React<Web3Provider>();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<UserAccountTypes[]>([]);
  const [isChange, setChange] = useState<boolean>(false);
  const [accountName, setAccountName] = useState<string>("");
  const [isAllowance, setAllowance] = useState<boolean>(false);

  const handleOnClick = () => {
    setModalOpen(true);
  };
  const handleOnClose = () => {
    setModalOpen(false);
  };

  const toggleChange = () => {
    setChange((prevValue) => !prevValue);
  };

  const handleCreateAccountClick = useCallback(async () => {
    if (!library || !account || !accountName) {
      return;
    }
    const response = await bankService.createAccount(library, account, accountName);
    if (response.wait) {
      await response.wait();
    }
    setChange((isChange) => !isChange);
    setModalOpen(false);
  }, [accountName, library, account]);

  const debounceInputChange = useMemo(
    () =>
      debounce((event) => {
        event.preventDefault();
        setAccountName(event.target.value);
      }, 300),
    []
  );

  useEffect(() => debounceInputChange.cancel(), [debounceInputChange]);

  useEffect(() => {
    const fetchAllowance = async () => {
      if (!library || !account) {
        return;
      }
      const daiAllowance: BigNumber = await daiService.getAllowance(library, account, BANK_CONTRACT_ADDRESS);
      if (daiAllowance.eq(0)) {
        setAllowance(false);
      } else {
        setAllowance(true);
      }
    };
    fetchAllowance();
  }, [account, library, setAllowance]);

  useEffect(() => {
    const fetchAccountData = async () => {
      if (!library || !account) {
        return;
      }
      const { userAccountBalances, userAccountNames } = await bankService.getAllUserAccountInformation(
        library,
        account
      );
      console.log(userAccountBalances, userAccountNames);
      if (userAccountBalances && userAccountNames) {
        const indexArray = new Array(userAccountBalances.length).fill(0);
        const allAccounts = indexArray.map((_, index) => ({
          balance: userAccountBalances[index],
          name: userAccountNames[index],
        }));
        setAccounts(allAccounts);
      }
    };

    fetchAccountData();
  }, [isChange, library, account, setAccounts]);

  console.log(accounts);

  return (
    <div
      style={{
        display: "flex",
        justifyItems: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Text
        align="left"
        sx={{
          margin: "1.5rem",
          width: "75%",
          fontSize: "1.25rem",
          border: "2px solid black",
        }}
      >
        My Accounts:
      </Text>

      {accounts.map((accountData, index: number) => {
        return (
          <Account
            key={index}
            balance={ethers.utils.formatEther(accountData.balance)}
            name={accountData.name}
            toggleChange={toggleChange}
            isAllowance={isAllowance}
          />
        );
      })}

      <CreateAccountButton handleOnClick={handleOnClick} title="Create a bank account" />
      <CreateAccountModal
        isModalOpen={isModalOpen}
        handleOnClose={handleOnClose}
        handleCreateAccountClick={handleCreateAccountClick}
        debounceInputChange={debounceInputChange}
      />
    </div>
  );
};
export default AccountDetails;
