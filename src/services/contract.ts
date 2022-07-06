import { Web3Provider } from "@ethersproject/providers";
import { Contract, ContractInterface } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { AddressZero } from "@ethersproject/constants";

const getContract = (contractAddress: string, abi: ContractInterface, library: Web3Provider, account: string) => {
  if (!isAddress(account) || account === AddressZero) {
    throw Error(`Invalid 'address' parameter '${account}'.`);
  }
  const contract = new Contract(contractAddress, abi, library);
  return contract;
};

export default getContract;
