import { Modal, Text, Input, Button } from "@mantine/core";
import { ChangeEventHandler, useState } from "react";

interface IWithdrawModalProps {
  isModalOpen: boolean;
  handleOnClose: () => void;
  handleWithdrawButtonClick: (tokenAmount: string) => Promise<any>;
  title: string;
}

const WithdrawModal = ({ isModalOpen, handleOnClose, handleWithdrawButtonClick, title }: IWithdrawModalProps) => {
  const [tokenInput, setTokenInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleTokenInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    setTokenInput(event.target.value);
  };
  const onClick = async () => {
    setLoading(true);
    await handleWithdrawButtonClick(tokenInput);
    setLoading(false);
  };

  return (
    <Modal
      centered
      opened={isModalOpen}
      onClose={() => {
        handleOnClose();
        setTokenInput("");
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
      <Input
        size="md"
        placeholder="Amount"
        sx={{ width: "100%", marginBottom: "1rem" }}
        onChange={handleTokenInputChange}
      />
      <Button fullWidth sx={{ marginTop: "1rem" }} onClick={onClick} loading={loading}>
        Withdraw
      </Button>
    </Modal>
  );
};

export default WithdrawModal;
