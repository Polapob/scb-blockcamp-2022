import { Modal, Text, Button } from "@mantine/core";
import { useCallback, useState } from "react";
import NumericalInput from "../Input/NumericalInput";

interface IWithdrawModalProps {
  isModalOpen: boolean;
  handleOnClose: () => void;
  handleWithdrawButtonClick: (tokenAmount: string) => Promise<any>;
  title: string;
}

const WithdrawModal = ({ isModalOpen, handleOnClose, handleWithdrawButtonClick, title }: IWithdrawModalProps) => {
  const [tokenInput, setTokenInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const onClick = useCallback(async () => {
    setLoading(true);
    await handleWithdrawButtonClick(tokenInput);
    setLoading(false);
  }, [handleWithdrawButtonClick, setLoading, tokenInput]);

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
        placeholder={"Amount"}
        value={tokenInput}
      />
      <Button disabled={tokenInput === ""} fullWidth sx={{ marginTop: "1rem" }} onClick={onClick} loading={loading}>
        Withdraw
      </Button>
    </Modal>
  );
};

export default WithdrawModal;
