import { DAI_CONTRACT_ADDRESS } from "../constants/const";
import getContract from "../utils/contract";
import BEP20_ABI from "../constants/bep20Abi.json";
import { Web3Provider } from "@ethersproject/providers";
import { BigNumber, ContractInterface } from "ethers";

class TokenService {
  tokenAddress: string;
  tokenAbi: ContractInterface;
  constructor(tokenAddress: string, abi: ContractInterface) {
    this.tokenAddress = tokenAddress;
    this.tokenAbi = abi;
  }
  getBalance = async (library: Web3Provider, account: string) => {
    const tokenContract = getContract(this.tokenAddress, this.tokenAbi, library, account);
    const balance: BigNumber = await tokenContract.balanceOf(account);
    return balance;
  };
  getAllowance = async (library: Web3Provider, account: string, spender: string) => {
    const tokenContract = getContract(this.tokenAddress, this.tokenAbi, library, account);
    return await tokenContract.allowance(account, spender);
  };
  getDecimals = async (library: Web3Provider, account: string) => {
    const tokenContract = getContract(this.tokenAddress, this.tokenAbi, library, account);
    return await tokenContract.decimals();
  };
  approve = async (library: Web3Provider, account: string, spender: string, amount: BigNumber) => {
    try {
      const tokenContract = getContract(this.tokenAddress, this.tokenAbi, library, account);
      const tokenSigner = tokenContract.connect(library.getSigner());
      const response = await tokenSigner.approve(spender, amount);
      return response;
    } catch (err) {
      return err;
    }
  };
}

export const daiService = new TokenService(DAI_CONTRACT_ADDRESS, BEP20_ABI);
