import { Web3Provider } from "@ethersproject/providers";
import { Grid, Button, Stack } from "@mantine/core";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { Dispatch, SetStateAction, useState } from "react";
import { BANK_CONTRACT_ADDRESS, MAX_INT } from "../../constants/const";
import { useNotification } from "../../context/NotificationContext";
import { bankService } from "../../services/bankService";
import { daiService } from "../../services/tokenService";
import handleNotificationFromResponse from "../../utils/handleNotificationFromResponse";
import LoadingButton from "../Button/LoadingButton";
import DepositModal from "../Modal/DepositModal";
import TransferModal from "../Modal/TransferModal";
import WithdrawModal from "../Modal/WithdrawModal";

interface IAccountProps {
  name: string;
  balance: string;
  toggleChange: () => void;
  isAllowance: boolean;
}

interface IButtonGroupsProps {
  setDepositModalOpen: Dispatch<SetStateAction<boolean>>;
  setWithdrawModalOpen: Dispatch<SetStateAction<boolean>>;
  setTransferModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ButtonGroups = ({ setDepositModalOpen, setWithdrawModalOpen, setTransferModalOpen }: IButtonGroupsProps) => {
  return (
    <>
      <Grid.Col
        span={12}
        sx={{
          width: "100%",
        }}
      >
        <Stack
          sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", rowGap: "1rem" }}
        >
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
      </Grid.Col>
    </>
  );
};

const Account = ({ name, balance, toggleChange, isAllowance }: IAccountProps) => {
  const { library, account } = useWeb3React<Web3Provider>();
  const { addNotification } = useNotification();
  const [isDepositModalOpen, setDepositModalOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setTransferModalOpen] = useState<boolean>(false);
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState<boolean>(false);

  const handleAllowanceClick = async () => {
    if (!library || !account) {
      return;
    }

    const response = await daiService.approve(library, account, BANK_CONTRACT_ADDRESS, MAX_INT);
    console.log(response);

    handleNotificationFromResponse(response, addNotification, "Successfully Allowance DAI Token.");
  };

  const handleDepositButtonClick = async (tokenAmount: string) => {
    if (!library || isNaN(parseFloat(tokenAmount)) || !account) {
      return;
    }
    const tokenInputBignumber = ethers.utils.parseEther(tokenAmount);
    const response = await bankService.depositMoney(library, account, name, tokenInputBignumber);
    console.log("response =", response.error.data.mesage);

    handleNotificationFromResponse(response, addNotification, `Successfully deposit ${tokenAmount} DAI to ${account}`);

    toggleChange();
    setDepositModalOpen(false);
    return response;
  };

  const handleWithdrawButtonClick = async (tokenAmount: string) => {
    if (!library || isNaN(parseFloat(tokenAmount)) || !account) {
      return;
    }
    const tokenInputBignumber = ethers.utils.parseEther(tokenAmount);
    const response = await bankService.withdrawMoney(library, account, name, tokenInputBignumber);
    console.log(response);

    handleNotificationFromResponse(
      response,
      addNotification,
      `Successfully withdraw ${tokenAmount} DAI from ${account}`
    );

    toggleChange();
    setWithdrawModalOpen(false);
    return response;
  };

  const handleTransferButtonClick = async (transferTo: string, tokenAmount: string) => {
    if (!library || isNaN(parseFloat(tokenAmount)) || !account) {
      return;
    }
    const tokenInputBignumber = ethers.utils.parseEther(tokenAmount);
    const response = await bankService.transferMoney(library, account, name, transferTo, tokenInputBignumber);

    handleNotificationFromResponse(
      response,
      addNotification,
      `Successfully transfer ${tokenAmount} DAI from ${account} to ${transferTo}`
    );

    toggleChange();
    setTransferModalOpen(false);
    return response;
  };

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
    </Grid>
  );
};

export default Account;
