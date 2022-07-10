import { Modal, Text, Button, Grid, TextInput } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { UserAccountTypes } from "../AccountDetails";
import TransferField from "../Input/TransferField";

interface ITransferManyModalProps {
  isModalOpen: boolean;
  handleOnClose: () => void;
  handleTransferManyClick: (transferTo: string[], eachTransferAmount: string[]) => Promise<void>;
  title: string;
  accounts: UserAccountTypes[];
}

type TransferDataType = Record<"name" | "amount", string>;

const preprocessData = (transferData: TransferDataType[]) => {
  const eachAmounts = transferData.map((eachData) => eachData.amount);
  const eachAccounts = transferData.map((eachData) => eachData.name);
  return {
    eachAmounts,
    eachAccounts,
  };
};

const disabledButton = (transferData: TransferDataType[]) => {
  const unfillData = transferData.filter((eachData) => {
    if (eachData.amount === "" || eachData.name === "") {
      return true;
    }
    return false;
  });
  return unfillData.length > 0;
};

const calculateAccountFees = (transferData: TransferDataType[], accounts: UserAccountTypes[]) => {
  const isProblem = disabledButton(transferData);
  if (isProblem) {
    return 0;
  }
  const transferFee = transferData.reduce((prevValue, { name, amount }) => {
    const isFind = accounts.find((eachAccount) => eachAccount.name === name);
    const fee = isFind ? 0 : 0.01 * parseFloat(amount);
    return prevValue + fee;
  }, 0);
  return transferFee;
};

const TransferManyModal = ({ isModalOpen, handleOnClose, handleTransferManyClick, title, accounts }: ITransferManyModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [transferData, setTransferData] = useState<TransferDataType[]>([{ name: "", amount: "" }]);
  const isDisabledClose = useMemo(() => transferData.length <= 1, [transferData]);
  const [isChange, setIsChange] = useState<boolean>(false);

  const removeData = useCallback((index: number) => {
    setTransferData((prevData) => {
      const filterData = [...prevData.slice(0, index), ...prevData.slice(index + 1)];
      return filterData;
    });
  }, []);

  const addData = useCallback(() => {
    setTransferData((prevData) => [...prevData, { name: "", amount: "" }]);
  }, []);

  const handleOnChange = useCallback(
    (input: string, title: "name" | "amount", index: number) => {
      setTransferData((prevData) => {
        prevData[index] = { ...prevData[index], [title]: input };
        return prevData;
      });
      setIsChange((prevValue) => !prevValue);
    },
    [setIsChange]
  );

  const onClick = useCallback(async () => {
    setLoading(true);
    const { eachAccounts, eachAmounts } = preprocessData(transferData);
    await handleTransferManyClick(eachAccounts, eachAmounts);
    setTransferData([{ name: "", amount: "" }]);
    setLoading(false);
  }, [handleTransferManyClick, transferData, setLoading, setTransferData]);

  return (
    <Modal
      centered
      opened={isModalOpen}
      onClose={() => {
        handleOnClose();
        setTransferData([{ name: "", amount: "" }]);
        if (loading) {
          setLoading(false);
        }
      }}
      title={title}
      size={800}
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
      <Grid columns={12} sx={{ width: "100%" }}>
        <Grid.Col span={5} sx={{ display: "flex", justifyContent: "start", alignItems: "start" }}>
          <Text size="lg">To Account</Text>
        </Grid.Col>
        <Grid.Col span={5}>
          <Text size="lg">Amount</Text>
        </Grid.Col>
        {transferData.map((eachData, index) => (
          <TransferField
            key={index}
            handleOnChange={handleOnChange}
            removeData={() => {
              removeData(index);
            }}
            name={eachData.name}
            amount={eachData.amount}
            index={index}
            disabledClose={isDisabledClose}
          />
        ))}
      </Grid>
      <Button
        fullWidth
        disabled={false}
        sx={{ marginTop: "1rem", width: "50%" }}
        onClick={() => {
          addData();
        }}
      >
        add new transaction
      </Button>
      <Text size="lg" sx={{ marginTop: "0.5rem" }}>
        Fee 0% When Transfer in your accounts.
      </Text>
      <Text size="lg">Fee 1% When Transfer in other accounts.</Text>
      <Text size="lg">Total Fees: {calculateAccountFees(transferData, accounts)} DAI</Text>
      <Button fullWidth disabled={disabledButton(transferData)} sx={{ marginTop: "1rem" }} onClick={onClick} loading={loading}>
        Transfer to many account
      </Button>
    </Modal>
  );
};

export default TransferManyModal;
