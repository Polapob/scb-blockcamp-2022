import { Web3Provider } from "@ethersproject/providers";
import { Modal, Text, Input, Button } from "@mantine/core";
import { useWeb3React } from "@web3-react/core";
import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import NumericalInput from "../Input/NumericalInput";

interface IDepositModalProps {
  isModalOpen: boolean;
  handleOnClose: () => void;
  handleDepositButtonClick: (tokenAmount: string) => Promise<void>;
  title: string;
}

const DepositModal = ({ isModalOpen, handleOnClose, handleDepositButtonClick, title }: IDepositModalProps) => {
  const [tokenInput, setTokenInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const onClick = async () => {
    setLoading(true);
    await handleDepositButtonClick(tokenInput);
    setLoading(false);
  };

  return (
    <Modal
      centered
      opened={isModalOpen}
      onClose={() => {
        handleOnClose();
        setTokenInput("");
        if (loading) {
          setLoading(false);
        }
      }}
      title={title}
      size={600}
      styles={{
        title: {
          fontSize: "1.5rem",
        },
        body: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          rowGap: "0.5rem",
          width: "100%",
        },
      }}
    >
      <Text
        size="lg"
        align="left"
        sx={{
          width: "100%",
        }}
      >
        Amount (DAI COIN)
      </Text>
      <NumericalInput
        onValueChange={(value) => {
          setTokenInput(value);
        }}
        placeholder="Amount"
        value={tokenInput}
      />
      <Button fullWidth disabled={tokenInput === ""} sx={{ marginTop: "1rem" }} onClick={onClick} loading={loading}>
        Deposit
      </Button>
    </Modal>
  );
};

export default DepositModal;
