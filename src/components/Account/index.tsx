import { Web3Provider } from "@ethersproject/providers";
import { Text, Grid, Tabs, Button } from "@mantine/core";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { Dispatch, MouseEventHandler, SetStateAction, useMemo, useState } from "react";
import { BANK_CONTRACT_ADDRESS, MAX_INT } from "../../constants/const";
import { bankService } from "../../services/bankService";
import { daiService } from "../../services/tokenService";
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
      <Grid.Col span={4}>
        <Button
          onClick={() => {
            setDepositModalOpen(true);
          }}
        >
          Deposit
        </Button>
      </Grid.Col>
      <Grid.Col span={4}>
        <Button
          onClick={() => {
            setWithdrawModalOpen(true);
          }}
        >
          Withdraw
        </Button>
      </Grid.Col>
      <Grid.Col span={4}>
        <Button
          onClick={() => {
            setTransferModalOpen(true);
          }}
        >
          Transfer
        </Button>
      </Grid.Col>
    </>
  );
};

const Account = ({ name, balance, toggleChange, isAllowance }: IAccountProps) => {
  const { library, account } = useWeb3React<Web3Provider>();
  const [isDepositModalOpen, setDepositModalOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setTransferModalOpen] = useState<boolean>(false);
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState<boolean>(false);

  const handleOnAllowanceClick = async () => {
    if (!library || !account) {
      return;
    }
    await daiService.approve(library, account, BANK_CONTRACT_ADDRESS, MAX_INT);
  };

  const handleDepositButtonClick = async (tokenAmount: string) => {
    if (!library || isNaN(parseFloat(tokenAmount)) || !account) {
      return;
    }
    const tokenInputBignumber = ethers.utils.parseEther(tokenAmount);
    const response = await bankService.depositMoney(library, account, name, tokenInputBignumber);
    if (response.wait) {
      await response.wait();
    }
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
    if (response.wait) {
      await response.wait();
    }
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
    if (response.wait) {
      await response.wait();
    }
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
        width: "25%",
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
        <Button fullWidth onClick={handleOnAllowanceClick}>
          Allowance Dai Token
        </Button>
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
