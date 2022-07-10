import { Web3Provider } from "@ethersproject/providers";
import { Text, Button } from "@mantine/core";
import { useWeb3React } from "@web3-react/core";

interface INavbarProps {
  handleOnClick: () => void;
}

const Navbar = ({ handleOnClick }: INavbarProps) => {
  const { account } = useWeb3React<Web3Provider>();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Text
        style={{
          fontSize: "1.5rem",
        }}
        weight="700"
      >
        10XBank
      </Text>
      {account ? (
        <Text
          size="md"
          sx={{
            border: "2px solid #228be6",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          {account}
        </Text>
      ) : (
        <Button onClick={handleOnClick}>Connect Wallet</Button>
      )}
    </div>
  );
};
export default Navbar;
