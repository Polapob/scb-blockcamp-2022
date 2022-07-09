import { Web3Provider } from "@ethersproject/providers";
import { Modal, Text, Input, Button } from "@mantine/core";
import { useWeb3React } from "@web3-react/core";
import { DebouncedFunc } from "lodash";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import useInputDebounce from "../../hooks/useInputDebounce";
import { bankService } from "../../services/bankService";
import handleNotificationFromResponse from "../../utils/handleNotificationFromResponse";

interface ICreateAccountModalProps {
  isModalOpen: boolean;
  handleOnClose: () => void;
  toggleChange: () => void;
}

const CreateAccountModal = ({ isModalOpen, handleOnClose, toggleChange }: ICreateAccountModalProps) => {
  const { library, account } = useWeb3React<Web3Provider>();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [accountName, setAccountName] = useState<string>("");
  const debounceInputChange = useInputDebounce<string>(setAccountName);

  const handleCreateAccountClick = useCallback(async () => {
    if (!library || !account || !accountName) {
      return;
    }
    const response = await bankService.createAccount(library, account, accountName);
    await response.wait();

    handleNotificationFromResponse(response, addNotification, "Successfully Create new account");

    toggleChange();
    handleOnClose();
  }, [accountName, library, account, addNotification, handleOnClose, toggleChange]);

  const onClick = async () => {
    setLoading(true);
    await handleCreateAccountClick();
    setLoading(false);
  };

  return (
    <Modal
      centered
      opened={isModalOpen}
      onClose={() => {
        handleOnClose();
        setLoading(false);
      }}
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
      <Input size="md" placeholder="Account name" sx={{ width: "100%" }} onChange={debounceInputChange} />
      <Button
        loading={loading}
        disabled={accountName === ""}
        fullWidth
        sx={{ marginTop: "2rem", marginBottom: "1rem" }}
        onClick={onClick}
      >
        Create New Account
      </Button>
    </Modal>
  );
};
export default CreateAccountModal;
