/**
 * @fileoverview Description of the file's purpose
 * @author Reynor Lou
 * @version 1.1.0
 * @date 2024-7-18
 */

const readline = require('readline');
const crypto = require('crypto');
const fs = require('fs');
const BN=require('bn.js');
const {Web3} = require('web3');
require('dotenv').config({ path: './config.env' });

const infuraProjectId = 'b85b1201536841b19484f5f3917bcbc3';
const sepoliaUrl = `https://sepolia.infura.io/v3/${infuraProjectId}`;
const web3 = new Web3(sepoliaUrl);

const contractAddress= process.env.CONTRACT_ADDRESS;
const Txaddress= process.env.TX_ADDRESS;

const ManagerAccount=process.env.MANAGER_ADDR;
const ManagerPrivateKey=process.env.MANAGER_KEY;

const acc0=process.env.ACCO_ADDR;
const acc0Key=process.env.ACCO_KEY

const abi = JSON.parse(fs.readFileSync('./contract/build/IPcore.abi'), 'utf8');
const contract = new web3.eth.Contract(abi, contractAddress);

const t_abi = JSON.parse(fs.readFileSync('./contract/build/Transaction.abi'), 'utf8');
const t_contract = new web3.eth.Contract(abi, Txaddress);

async function registerIP(category,name,description,owner,md5,timestamp){
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const tx = {
        from: ManagerAccount,
        to: contractAddress,
        data: contract.methods.registerIP(category,name,description,owner,md5,timestamp).encodeABI(),
        gas: 500000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, ManagerPrivateKey);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

async function getIP(id) {
    const value = await contract.methods.getIP(id).call();
    return value;
}

async function getBalance() {
    const value = await contract.methods.getBalance().call();
    return value;
}

async function setTransaction(address) {
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const tx = {
        from: ManagerAccount,
        to: contractAddress,
        data: contract.methods.setTransaction(address).encodeABI(),
        gas: 500000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, ManagerPrivateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

async function setCore(address) {
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const tx = {
        from: ManagerAccount,
        to: Txaddress,
        data: t_contract.methods.setIPcore(address).encodeABI(),
        gas: 500000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, ManagerPrivateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

async function invalidateIP(id) {
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const tx = {
        from: ManagerAccount,
        to: contractAddress,
        data: contract.methods.invalidateIP(id).encodeABI(),
        gas: 500000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, ManagerPrivateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

async function restoreIP(id) {
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const tx = {
        from: ManagerAccount,
        to: contractAddress,
        data: contract.methods.restoreIP(id).encodeABI(),
        gas: 500000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, ManagerPrivateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

async function sellIP(id,price) {
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const tx = {
        from: acc0,
        to: contractAddress,
        data: contract.methods.sellIP(id,price).encodeABI(),
        gas: 500000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, acc0Key);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

async function withdrawIP(id) {
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const tx = {
        from: acc0,
        to: contractAddress,
        data: contract.methods.withdrawIP(id).encodeABI(),
        gas: 500000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, acc0Key);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

async function transfer(id, ETH) {
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const valueInWei = web3.utils.toWei(ETH.toString(), 'ether');
    const tx = {
        from: acc0,
        to: contractAddress,
        data: contract.methods.transfer(id).encodeABI(),
        value: web3.utils.toHex(valueInWei),
        gas: 500000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, acc0Key);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}


function openReadline() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return rl;
}

function ask(query,rl) {
    return new Promise(resolve => rl.question(query + '\n', resolve));
}

function closeReadline(rl) {
    rl.close();
}

function getMD5(filepath){
    const data = fs.readFileSync(filepath);
    const hash = crypto.createHash('md5').update(data).digest('hex');
    return hash;
}
module.exports = { ask, closeReadline,getMD5,registerIP,invalidateIP,
                    restoreIP,setCore,setTransaction,getIP,getBalance,
                    sellIP,withdrawIP ,transfer
                
                };
