import { Button } from "@mantine/core";

interface ICreateAccountButtonProps {
  handleOnClick: () => void;
  title: string;
}

const CreateAccountButton = ({ handleOnClick, title }: ICreateAccountButtonProps) => {
  return <Button onClick={handleOnClick}>{title}</Button>;
};

export default CreateAccountButton;
