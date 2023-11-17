import Web3 from "web3";
import { Config } from "../config";
import { ERC20_ABI } from "../abis/erc20";
import BigNumber from 'bignumber.js';
import NP from 'number-precision';

export class Web3Service {
  constructor(private web3: Web3) { }

  static getInstance() {
    const web3 = new Web3(Config.web3.providerUri)
    return new Web3Service(web3)
  }

  async send(address: string, amount: number) {
    const contract = new this.web3.eth.Contract(ERC20_ABI, Config.web3.usdcContractAddress);
    const account = this.web3.eth.accounts.privateKeyToAccount(Config.web3.usdcPoolPrivateKey);
    const gasPrice = await this.web3.eth.getGasPrice();
    const decimalsString = await contract.methods.decimals().call();
    const decimals = Number(decimalsString);
    const amountToSend = Math.floor(amount * Math.pow(10, decimals))
    const transferFunc = contract.methods.transfer(address, amountToSend);

    const gasLimit = await transferFunc.estimateGas({
      from: account.address,
    });

    const transactionObject = {
      from: account.address,
      to: Config.web3.usdcContractAddress,
      data: transferFunc.encodeABI(),
      gasPrice,
      gasLimit,
    };

    const signedTx = await account.signTransaction(transactionObject)

    const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)

    return receipt
  }
}