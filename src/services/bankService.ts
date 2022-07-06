import { Web3Provider } from "@ethersproject/providers";
import { BigNumber, ContractInterface } from "ethers";
import { BANK_CONTRACT_ADDRESS } from "../constants/const";
import BANK_CONTRACT_ABI from "../constants/bankAbi.json";
import getContract from "./contract";

class BankService {
  contractAddress: string;
  contractAbi: ContractInterface;
  constructor(address: string, abi: ContractInterface) {
    this.contractAddress = address;
    this.contractAbi = abi;
  }

  createAccount = async (library: Web3Provider, account: string, bankAccountName: string) => {
    try {
      const bankContract = getContract(this.contractAddress, this.contractAbi, library, account);
      const response = bankContract.createAccount(bankAccountName);
      return response;
    } catch (err) {
      return err;
    }
  };

  depositMoney = async (library: Web3Provider, account: string, bankAccountName: string, amount: BigNumber) => {
    try {
      const bankContract = getContract(this.contractAddress, this.contractAbi, library, account);
      const response = bankContract.deposit(bankAccountName, amount);
      return response;
    } catch (err) {
      return err;
    }
  };

  withdrawMoney = async (library: Web3Provider, account: string, bankAccountName: string, amount: BigNumber) => {
    try {
      const bankContract = getContract(this.contractAddress, this.contractAbi, library, account);
      const response = bankContract.withdraw(bankAccountName, amount);
      return response;
    } catch (err) {
      return err;
    }
  };

  transferMoney = async (
    library: Web3Provider,
    account: string,
    fromBankAccountName: string,
    toBankAccountName: string,
    amount: BigNumber
  ) => {
    try {
      const bankContract = getContract(this.contractAddress, this.contractAbi, library, account);
      const response = bankContract.transfer(fromBankAccountName, toBankAccountName, amount);
      return response;
    } catch (err) {
      return err;
    }
  };
}

export const bankService = new BankService(BANK_CONTRACT_ADDRESS, BANK_CONTRACT_ABI);
