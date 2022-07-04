import { Modal, Text, Input, Button } from "@mantine/core";
import { DebouncedFunc } from "lodash";

interface ICreateAccountModalProps {
  isModalOpen: boolean;
  handleOnClose: () => void;
  handleCreateAccountClick: () => void;
  debounceInputChange: DebouncedFunc<(event: any) => void>;
}

const CreateAccountModal = ({
  isModalOpen,
  handleOnClose,
  handleCreateAccountClick,
  debounceInputChange,
}: ICreateAccountModalProps) => {
  return (
    <Modal
      centered
      opened={isModalOpen}
      onClose={handleOnClose}
      title="Add new Account"
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
        sx={{ width: "100%" }}
        onChange={debounceInputChange}
      />
      <Button
        fullWidth
        sx={{ marginTop: "2rem", marginBottom: "1rem" }}
        onClick={handleCreateAccountClick}
      >
        Create New Account
      </Button>
    </Modal>
  );
};
export default CreateAccountModal;
