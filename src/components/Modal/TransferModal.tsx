import { Modal, Text, Input, Button } from "@mantine/core";
import { ChangeEventHandler, useState } from "react";
import NumericalInput from "../Input/NumericalInput";

interface ITransferModalProps {
  isModalOpen: boolean;
  handleOnClose: () => void;
  handleTransferButtonClick: (transferTo: string, tokenAmount: string) => Promise<any>;
  title: string;
}

const TransferModal = ({ isModalOpen, handleOnClose, handleTransferButtonClick, title }: ITransferModalProps) => {
  const [transferAccount, setTransferAccount] = useState<string>("");
  const [tokenInput, setTokenInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleTransferAccountChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    setTransferAccount(event.target.value);
  };

  const onClick = async () => {
    setLoading(true);
    await handleTransferButtonClick(transferAccount, tokenInput);
    setLoading(false);
  };

  return (
    <Modal
      centered
      opened={isModalOpen}
      onClose={() => {
        handleOnClose();
        setTokenInput("");
        setTransferAccount("");
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
        Account Name
      </Text>
      <Input
        size="md"
        placeholder="Account name"
        sx={{ width: "100%", marginBottom: "1rem" }}
        onChange={handleTransferAccountChange}
      />
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
      <Button fullWidth sx={{ marginTop: "1rem" }} onClick={onClick} loading={loading}>
        Transfer
      </Button>
    </Modal>
  );
};

export default TransferModal;
