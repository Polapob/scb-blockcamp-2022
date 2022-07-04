import { Modal, Text, Input, Button } from "@mantine/core";

interface IDepositModalProps {
  isModalOpen: boolean;
  handleOnClose: () => void;
  handleDepositButtonClick: () => void;
  title: string;
}

const DepositModal = ({
  isModalOpen,
  handleOnClose,
  handleDepositButtonClick,
  title,
}: IDepositModalProps) => {
  return (
    <Modal
      centered
      opened={isModalOpen}
      onClose={handleOnClose}
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
      <Input
        size="md"
        placeholder="Amount"
        sx={{ width: "100%", marginBottom: "1rem" }}
      />
      <Button
        fullWidth
        sx={{ marginTop: "1rem" }}
        onClick={handleDepositButtonClick}
      >
        Deposit
      </Button>
    </Modal>
  );
};

export default DepositModal;
