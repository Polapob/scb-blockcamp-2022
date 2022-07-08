import { Text } from "@mantine/core";
import { useCallback, useState, useMemo, useEffect } from "react";
import CreateAccountButton from "../CreateAccountButton";
import debounce from "lodash.debounce";
import Account from "../Account";
import CreateAccountModal from "../Modal/CreateAccountModal";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { BANK_CONTRACT_ADDRESS } from "../../constants/const";
import { bankService } from "../../services/bankService";
import { BigNumber, ethers } from "ethers";
import { daiService } from "../../services/tokenService";

type UserAccountTypes = {
  name: string;
  balance: BigNumber;
};

const AccountDetails = () => {
  const { account, library } = useWeb3React<Web3Provider>();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<UserAccountTypes[]>([]);
  const [isChange, setChange] = useState<boolean>(false);
  const [isAllowance, setAllowance] = useState<boolean>(false);

  const toggleChange = useCallback(() => {
    setChange((prevValue) => !prevValue);
  }, []);

  const handleOnClose = useCallback(() => {
    setModalOpen(false);
  }, []);

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
          fontSize: "1.5rem",
        }}
      >
        My Accounts
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

      <CreateAccountButton
        handleOnClick={() => {
          setModalOpen(true);
        }}
        title="Create a bank account"
      />
      <CreateAccountModal isModalOpen={isModalOpen} handleOnClose={handleOnClose} toggleChange={toggleChange} />
    </div>
  );
};
export default AccountDetails;
