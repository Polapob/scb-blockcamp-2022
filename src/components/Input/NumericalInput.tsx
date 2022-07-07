import { Input } from "@mantine/core";
import { ChangeEventHandler } from "react";
import formatStringToNumber from "../../utils/formatStringToNumber";

interface INumericalInputProps {
  onValueChange: (value: string) => void;
  placeholder: string;
  value: string;
}
const numberRegex = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/;
const NumericalInput = ({ onValueChange, placeholder, value }: INumericalInputProps) => {
  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.value) {
      onValueChange("");
    }

    if (event.target.value.match(numberRegex)) {
      onValueChange(formatStringToNumber(event.target.value));
    }
  };

  return (
    <Input
      type="string"
      size="md"
      placeholder={placeholder}
      sx={{ width: "100%", marginBottom: "1rem" }}
      onChange={onChange}
      value={value}
    />
  );
};

export default NumericalInput;
