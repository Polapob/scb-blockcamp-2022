import { Web3Provider } from "@ethersproject/providers";
import { Grid, Button, Stack } from "@mantine/core";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { BANK_CONTRACT_ADDRESS, MAX_INT } from "../../constants/const";
import { useNotification } from "../../context/NotificationContext";
import { bankService } from "../../services/bankService";
import { daiService } from "../../services/tokenService";
import handleNotificationFromResponse from "../../utils/handleNotificationFromResponse";
import { UserAccountTypes } from "../AccountDetails";
import LoadingButton from "../Button/LoadingButton";
import DepositModal from "../Modal/DepositModal";
import TransferManyModal from "../Modal/TransferManyModal";
import TransferModal from "../Modal/TransferModal";
import WithdrawModal from "../Modal/WithdrawModal";

interface IAccountProps {
  name: string;
  balance: string;
  toggleChange: () => void;
  isAllowance: boolean;
  accounts: UserAccountTypes[];
}

interface IButtonGroupsProps {
  setDepositModalOpen: Dispatch<SetStateAction<boolean>>;
  setWithdrawModalOpen: Dispatch<SetStateAction<boolean>>;
  setTransferModalOpen: Dispatch<SetStateAction<boolean>>;
  setTransferManyModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ButtonGroups = ({ setDepositModalOpen, setWithdrawModalOpen, setTransferModalOpen, setTransferManyModalOpen }: IButtonGroupsProps) => {
  return (
    <>
      <Grid.Col
        span={12}
        sx={{
          width: "100%",
        }}
      >
        <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", rowGap: "1rem", marginBottom: "1rem" }}>
          <Button
            sx={{ width: "100%" }}
            onClick={() => {
              setDepositModalOpen(true);
            }}
          >
            Deposit
          </Button>
          <Button
            sx={{ width: "100%" }}
            onClick={() => {
              setWithdrawModalOpen(true);
            }}
          >
            Withdraw
          </Button>
          <Button
            sx={{ width: "100%" }}
            onClick={() => {
              setTransferModalOpen(true);
            }}
          >
            Transfer
          </Button>
        </Stack>
        <Button
          fullWidth
          onClick={() => {
            setTransferManyModalOpen(true);
          }}
        >
          Transfer To Many Accounts
        </Button>
      </Grid.Col>
    </>
  );
};

const Account = ({ name, balance, toggleChange, isAllowance, accounts }: IAccountProps) => {
  const { library, account } = useWeb3React<Web3Provider>();
  const { addNotification } = useNotification();
  const [isDepositModalOpen, setDepositModalOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setTransferModalOpen] = useState<boolean>(false);
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState<boolean>(false);
  const [isTransferManyModalOpen, setTransferManyModalOpen] = useState<boolean>(false);

  const handleAllowanceClick = useCallback(async () => {
    if (!library || !account) {
      return;
    }

    const response = await daiService.approve(library, account, BANK_CONTRACT_ADDRESS, MAX_INT);
    if (response.wait) {
      await response.wait();
    }
    toggleChange();

    handleNotificationFromResponse(response, addNotification, "Successfully Allowance DAI Token.");
  }, [account, addNotification, library, toggleChange]);

  const handleDepositButtonClick = useCallback(
    async (tokenAmount: string) => {
      if (!library || isNaN(parseFloat(tokenAmount)) || !account) {
        return;
      }
      const tokenInputBignumber = ethers.utils.parseEther(tokenAmount);
      const response = await bankService.depositMoney(library, account, name, tokenInputBignumber);

      if (response.wait) {
        await response.wait();
      }

      handleNotificationFromResponse(response, addNotification, `Successfully deposit ${tokenAmount} DAI to ${name}`);

      toggleChange();
      setDepositModalOpen(false);
      return response;
    },
    [account, addNotification, library, name, toggleChange]
  );

  const handleWithdrawButtonClick = useCallback(
    async (tokenAmount: string) => {
      if (!library || isNaN(parseFloat(tokenAmount)) || !account) {
        return;
      }
      const tokenInputBignumber = ethers.utils.parseEther(tokenAmount);
      const response = await bankService.withdrawMoney(library, account, name, tokenInputBignumber);

      if (response.wait) {
        await response.wait();
      }

      handleNotificationFromResponse(response, addNotification, `Successfully withdraw ${tokenAmount} DAI from ${name} to ${account}`);

      toggleChange();
      setWithdrawModalOpen(false);
      return response;
    },
    [account, addNotification, library, name, toggleChange]
  );

  const handleTransferButtonClick = useCallback(
    async (transferTo: string, tokenAmount: string) => {
      if (!library || isNaN(parseFloat(tokenAmount)) || !account) {
        return;
      }
      const tokenInputBignumber = ethers.utils.parseEther(tokenAmount);
      const response = await bankService.transferMoney(library, account, name, transferTo, tokenInputBignumber);

      if (response.wait) {
        await response.wait();
      }

      handleNotificationFromResponse(response, addNotification, `Successfully transfer ${tokenAmount} DAI from ${name} to ${transferTo}`);

      toggleChange();
      setTransferModalOpen(false);
      return response;
    },
    [account, addNotification, library, name, toggleChange]
  );

  const handleTransferManyClick = useCallback(
    async (transferTo: string[], eachTransferAmount: string[]) => {
      if (!library || !account) {
        return;
      }
      const eachAmounts = eachTransferAmount.map((amount) => ethers.utils.parseEther(amount));
      const response = await bankService.transferToMany(library, account, name, transferTo, eachAmounts);

      if (response.wait) {
        await response.wait();
      }

      handleNotificationFromResponse(response, addNotification, `Successfully transfer DAI from ${name} to many accounts.`);

      toggleChange();
      setTransferManyModalOpen(false);
    },
    [account, addNotification, library, name, toggleChange]
  );

  return (
    <Grid
      columns={12}
      justify="center"
      style={{
        justifyContent: "center",
        alignItems: "center",
        margin: "2.5rem",
        rowGap: "0.5rem",
        width: "50%",
      }}
    >
      <Grid.Col span={6}>Account name:</Grid.Col>
      <Grid.Col
        span={6}
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        {name}
      </Grid.Col>

      <Grid.Col span={6}>Balance:</Grid.Col>
      <Grid.Col
        span={6}
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        {balance} DAI
      </Grid.Col>

      {isAllowance ? (
        <ButtonGroups
          setTransferManyModalOpen={setTransferManyModalOpen}
          setDepositModalOpen={setDepositModalOpen}
          setWithdrawModalOpen={setWithdrawModalOpen}
          setTransferModalOpen={setTransferModalOpen}
        />
      ) : (
        <LoadingButton handleOnClick={handleAllowanceClick} text="Allowance Dai Token" />
      )}
      <TransferModal
        isModalOpen={isTransferModalOpen}
        handleOnClose={() => {
          setTransferModalOpen(false);
        }}
        handleTransferButtonClick={handleTransferButtonClick}
        title="Transfer DAI COIN to another account"
        accounts={accounts}
      />
      <WithdrawModal
        isModalOpen={isWithdrawModalOpen}
        handleOnClose={() => {
          setWithdrawModalOpen(false);
        }}
        handleWithdrawButtonClick={handleWithdrawButtonClick}
        title="Withdraw DAI COIN to your wallet"
      />
      <DepositModal
        isModalOpen={isDepositModalOpen}
        handleOnClose={() => {
          setDepositModalOpen(false);
        }}
        handleDepositButtonClick={handleDepositButtonClick}
        title="Deposit DAI COIN to your account"
      />
      <TransferManyModal
        isModalOpen={isTransferManyModalOpen}
        handleOnClose={() => {
          setTransferManyModalOpen(false);
        }}
        handleTransferManyClick={handleTransferManyClick}
        title="Transfer DAI COIN to many accounts"
        accounts={accounts}
      />
    </Grid>
  );
};

export default Account;
