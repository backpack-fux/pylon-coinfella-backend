"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Service = void 0;
const web3_1 = __importDefault(require("web3"));
const config_1 = require("../config");
const erc20_1 = require("../abis/erc20");
class Web3Service {
    constructor(web3) {
        this.web3 = web3;
    }
    static getInstance() {
        const web3 = new web3_1.default(config_1.Config.web3.providerUri);
        return new Web3Service(web3);
    }
    async send(address, amount) {
        const contract = new this.web3.eth.Contract(erc20_1.ERC20_ABI, config_1.Config.web3.usdcContractAddress);
        const account = this.web3.eth.accounts.privateKeyToAccount(config_1.Config.web3.usdcPoolPrivateKey);
        const gasPrice = await this.web3.eth.getGasPrice();
        const decimalsString = await contract.methods.decimals().call();
        const decimals = Number(decimalsString);
        const amountToSend = Math.floor(amount * Math.pow(10, decimals));
        const transferFunc = contract.methods.transfer(address, amountToSend);
        const gasLimit = await transferFunc.estimateGas({
            from: account.address,
        });
        const transactionObject = {
            from: account.address,
            to: config_1.Config.web3.usdcContractAddress,
            data: transferFunc.encodeABI(),
            gasPrice,
            gasLimit,
        };
        const signedTx = await account.signTransaction(transactionObject);
        const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return receipt;
    }
}
exports.Web3Service = Web3Service;
//# sourceMappingURL=web3Service.js.map