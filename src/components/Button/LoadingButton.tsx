import { Button, ButtonProps } from "@mantine/core";
import { useState } from "react";

interface ILoadingButtonProps extends Omit<ButtonProps<"button">, "onClick"> {
  handleOnClick: () => Promise<void>;
  text: string;
}

const LoadingButton = ({ handleOnClick, text, ...restProps }: ILoadingButtonProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const onClick = async () => {
    setLoading(true);
    await handleOnClick();
    setLoading(false);
  };
  return (
    <Button fullWidth onClick={onClick} loading={loading} {...restProps}>
      {text}
    </Button>
  );
};

export default LoadingButton;
