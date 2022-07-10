import { Grid, TextInput, Button } from "@mantine/core";
import debounce from "lodash.debounce";
import { memo, useEffect, useMemo, useState } from "react";
import NumericalInput from "./NumericalInput";

export interface IEachTransferFieldProps {
  removeData: () => void;
  handleOnChange: (input: string, title: "name" | "amount", index: number) => void;
  index: number;
  amount: string;
  name: string;
  disabledClose: boolean;
}

const EachTransferField = ({ removeData, handleOnChange, index, amount, name, disabledClose }: IEachTransferFieldProps) => {
  const [accountName, setAccountName] = useState<string>("");
  const [tokenInput, setTokenInput] = useState<string>("");
  const debounceInputChange = useMemo(
    () =>
      debounce((event) => {
        event.preventDefault();
        handleOnChange(event.target.value, "name", index);
      }, 300),
    [handleOnChange, index]
  );

  useEffect(() => {
    setAccountName(name);
    setTokenInput(amount);
  }, [amount, name]);

  useEffect(() => debounceInputChange.cancel(), [debounceInputChange]);
  return (
    <>
      <Grid.Col span={5}>
        <TextInput
          value={accountName}
          size="md"
          placeholder="Account name"
          onChange={(event) => {
            setAccountName(event.target.value);
            debounceInputChange(event);
          }}
        />
      </Grid.Col>
      <Grid.Col span={5}>
        <NumericalInput
          onValueChange={(value) => {
            setTokenInput(value);
            handleOnChange(value, "amount", index);
          }}
          placeholder="Amount"
          value={tokenInput}
          sx={{ width: "100%", marginTop: "0rem", marginBottom: "0rem" }}
        />
      </Grid.Col>
      <Grid.Col span={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Button onClick={removeData} disabled={disabledClose}>
          X
        </Button>
      </Grid.Col>
    </>
  );
};

export default memo(EachTransferField);
