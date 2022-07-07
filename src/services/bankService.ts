import { Web3Provider } from "@ethersproject/providers";
import { BigNumber, ContractInterface } from "ethers";
import { BANK_CONTRACT_ADDRESS } from "../constants/const";
import BANK_CONTRACT_ABI from "../constants/bankAbi.json";
import getContract from "../utils/contract";
import { Multicall, ContractCallResults, ContractCallContext } from "ethereum-multicall";
import { ethers } from "ethers";

let provider = ethers.getDefaultProvider();
const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

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
      const bankSigner = bankContract.connect(library.getSigner());
      const response = await bankSigner.createAccount(bankAccountName);
      return response;
    } catch (err) {
      return err;
    }
  };

  depositMoney = async (library: Web3Provider, account: string, bankAccountName: string, amount: BigNumber) => {
    try {
      const bankContract = getContract(this.contractAddress, this.contractAbi, library, account);
      const bankSigner = bankContract.connect(library.getSigner());
      const response = await bankSigner.deposit(bankAccountName, amount);
      return response;
    } catch (err) {
      return err;
    }
  };

  withdrawMoney = async (library: Web3Provider, account: string, bankAccountName: string, amount: BigNumber) => {
    try {
      const bankContract = getContract(this.contractAddress, this.contractAbi, library, account);
      const bankSigner = bankContract.connect(library.getSigner());
      const response = await bankSigner.withdraw(bankAccountName, amount);
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
      const bankSigner = bankContract.connect(library.getSigner());
      const response = await bankSigner.transfer(fromBankAccountName, toBankAccountName, amount);
      return response;
    } catch (err) {
      return err;
    }
  };

  getAllUserAccountInformation = async (
    library: Web3Provider,
    account: string
  ): Promise<{
    userAccountBalances: BigNumber[];
    userAccountNames: string[];
  }> => {
    try {
      const bankContract = getContract(this.contractAddress, this.contractAbi, library, account);
      const bankSigner = bankContract.connect(library.getSigner());
      const userAccountNames: string[] = await bankSigner.getSenderAccounts();
      console.log(userAccountNames);
      const userAccountBalances: BigNumber[] = await bankSigner.getAccountBalances(userAccountNames);
      console.log(userAccountBalances);
      return {
        userAccountBalances,
        userAccountNames,
      };
    } catch (err) {
      console.log(err);
      return {} as {
        userAccountBalances: BigNumber[];
        userAccountNames: string[];
      };
    }
  };
}

export const bankService = new BankService(BANK_CONTRACT_ADDRESS, BANK_CONTRACT_ABI);
