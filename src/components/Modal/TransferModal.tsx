import { Modal, Text, Input, Button } from "@mantine/core";

interface ITransferModalProps {
  isModalOpen: boolean;
  handleOnClose: () => void;
  handleTransferButtonClick: () => void;
  title: string;
}

const TransferModal = ({
  isModalOpen,
  handleOnClose,
  handleTransferButtonClick,
  title,
}: ITransferModalProps) => {
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
        onClick={handleTransferButtonClick}
      >
        Transfer
      </Button>
    </Modal>
  );
};

export default TransferModal;
