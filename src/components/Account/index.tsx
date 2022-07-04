import { Text, Grid, Tabs, Button } from "@mantine/core";
import { useState } from "react";
import DepositModal from "../Modal/DepositModal";
import TransferModal from "../Modal/TransferModal";
import WithdrawModal from "../Modal/WithdrawModal";

interface IAccountProps {
  name: string;
  balance: number;
}

const Account = ({ name, balance }: IAccountProps) => {
  const [isDepositModalOpen, setDepositModalOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setTransferModalOpen] = useState<boolean>(false);
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState<boolean>(false);

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
      <TransferModal
        isModalOpen={isTransferModalOpen}
        handleOnClose={() => {
          setTransferModalOpen(false);
        }}
        handleTransferButtonClick={() => {
          setTransferModalOpen(false);
        }}
        title="Transfer DAI COIN to another account"
      />
      <WithdrawModal
        isModalOpen={isWithdrawModalOpen}
        handleOnClose={() => {
          setWithdrawModalOpen(false);
        }}
        handleWithdrawButtonClick={() => {
          setWithdrawModalOpen(false);
        }}
        title="Withdraw DAI COIN to your wallet"
      />
      <DepositModal
        isModalOpen={isDepositModalOpen}
        handleOnClose={() => {
          setDepositModalOpen(false);
        }}
        handleDepositButtonClick={() => {
          setDepositModalOpen(false);
        }}
        title="Deposit DAI COIN to your account"
      />
    </Grid>
  );
};

export default Account;
