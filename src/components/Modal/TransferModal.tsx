import { Modal, Text, Input, Button } from "@mantine/core";
import { ChangeEventHandler, useMemo, useState } from "react";
import useInputDebounce from "../../hooks/useInputDebounce";
import { UserAccountTypes } from "../AccountDetails";
import LoadingButton from "../Button/LoadingButton";
import NumericalInput from "../Input/NumericalInput";

interface ITransferModalProps {
  isModalOpen: boolean;
  handleOnClose: () => void;
  handleTransferButtonClick: (transferTo: string, tokenAmount: string) => Promise<any>;
  title: string;
  accounts: UserAccountTypes[];
}

const findAccountInAccounts = (accounts: UserAccountTypes[], transferAccount: string) => {
  return accounts.find((eachAccount) => transferAccount === eachAccount.name);
};

const TransferModal = ({
  isModalOpen,
  handleOnClose,
  handleTransferButtonClick,
  title,
  accounts,
}: ITransferModalProps) => {
  const [transferAccount, setTransferAccount] = useState<string>("");
  const [tokenInput, setTokenInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const isOwnAccount = useMemo(() => {
    return findAccountInAccounts(accounts, transferAccount);
  }, [accounts, transferAccount]);

  const debounceInputChange = useInputDebounce<string>(setTransferAccount);

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
        Account Name
      </Text>
      <Input
        size="md"
        placeholder="Account name"
        sx={{ width: "100%", marginBottom: "1rem" }}
        onChange={debounceInputChange}
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

      {tokenInput && transferAccount && (
        <Text>{isOwnAccount ? "0% Fee = 0 DAI" : `1% Fee = ${0.01 * parseFloat(tokenInput)} DAI`}</Text>
      )}

      <Button
        fullWidth
        disabled={tokenInput === "" || transferAccount === ""}
        sx={{ marginTop: "1rem" }}
        onClick={onClick}
        loading={loading}
      >
        Transfer
      </Button>
    </Modal>
  );
};

export default TransferModal;
