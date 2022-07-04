import { Text, Modal, Input, Button } from "@mantine/core";
import {
  ChangeEventHandler,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from "react";
import CreateAccountButton from "../CreateAccountButton";
import debounce from "lodash.debounce";
import Account from "../Account";
import CreateAccountModal from "../Modal/CreateAccountModal";

const AccountDetails = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [accountName, setAccountName] = useState<string>("");
  const handleOnClick = () => {
    setModalOpen(true);
  };
  const handleOnClose = () => {
    setModalOpen(false);
  };
  const handleCreateAccountClick = useCallback(() => {
    setAccounts((prevState) => [...prevState, accountName]);
    setModalOpen(false);
  }, [accountName]);

  const debounceInputChange = useMemo(
    () =>
      debounce((event) => {
        event.preventDefault();
        setAccountName(event.target.value);
      }, 300),
    []
  );

  useEffect(() => debounceInputChange.cancel(), [debounceInputChange]);

  console.log(accounts);

  return (
    <div
      style={{
        display: "flex",
        justifyItems: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Text
        align="left"
        sx={{
          margin: "1.5rem",
          width: "75%",
          fontSize: "1.25rem",
          border: "2px solid black",
        }}
      >
        My Accounts:
      </Text>

      {accounts.map((accountName: string, index: number) => {
        return <Account key={index} balance={0} name={accountName} />;
      })}

      <CreateAccountButton handleOnClick={handleOnClick} />
      <CreateAccountModal
        isModalOpen={isModalOpen}
        handleOnClose={handleOnClose}
        handleCreateAccountClick={handleCreateAccountClick}
        debounceInputChange={debounceInputChange}
      />
    </div>
  );
};
export default AccountDetails;
