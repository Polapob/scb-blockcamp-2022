import { Button } from "@mantine/core";

interface ICreateAccountButtonProps {
  handleOnClick: () => void;
}

const CreateAccountButton = ({ handleOnClick }: ICreateAccountButtonProps) => {
  return <Button onClick={handleOnClick}>+ Create Bank Account</Button>;
};

export default CreateAccountButton;
