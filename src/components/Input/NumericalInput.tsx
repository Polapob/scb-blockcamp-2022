import { TextInput, TextInputProps } from "@mantine/core";
import { ChangeEventHandler } from "react";
import formatStringToNumber from "../../utils/formatStringToNumber";

interface INumericalInputProps extends Omit<TextInputProps, "onChange"> {
  onValueChange: (value: string) => void;
  placeholder: string;
  value: string;
}
const numberRegex = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/;
const NumericalInput = ({ onValueChange, placeholder, value, ...restProps }: INumericalInputProps) => {
  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.value) {
      onValueChange("");
    }

    if (event.target.value.match(numberRegex)) {
      onValueChange(formatStringToNumber(event.target.value));
    }
  };

  return (
    <TextInput
      sx={{ width: "100%", marginTop: "1rem", marginBottom: "1rem" }}
      type="text"
      size="md"
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      {...restProps}
    />
  );
};

export default NumericalInput;
