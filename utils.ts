/**
 * @fileoverview Description of the file's purpose
 * @author Reynor Lou
 * @version 1.1.0
 * @date 2024-7-18
 */
// D4Rz3rEQQ
const readline = require('readline');
const crypto = require('crypto');
const fs = require('fs');
const BN=require('bn.js');
const {Web3} = require('web3');
require('dotenv').config({ path: './config.env' });

const infuraProjectId = 'b85b1201536841b19484f5f3917bcbc3';
const sepoliaUrl = `https://sepolia.infura.io/v3/${infuraProjectId}`;
const web3 = new Web3(sepoliaUrl);

//IpScore'ip_contract address
const IpScoreAddress= process.env.CONTRACT_ADDRESS;
//transaction‘ip_contract address
const Txaddress= process.env.TX_ADDRESS;

const ManagerAccount=process.env.MANAGER_ADDR;
const ManagerPrivateKey=process.env.MANAGER_KEY;

//ip' owner
// const ipowner=process.env.ACCO_ADDR;
// const ipownerKey=process.env.ACCO_KEY

const ip_abi = JSON.parse(fs.readFileSync('./contract/build/IPcore.abi'), 'utf8');
const ip_contract = new web3.eth.Contract(ip_abi, IpScoreAddress);

const t_abi = JSON.parse(fs.readFileSync('./contract/build/Transaction.abi'), 'utf8');
const t_contract = new web3.eth.Contract(t_abi, Txaddress);

async function registerIP(category,name,description,owner,md5,timestamp){
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const tx = {
        from: ManagerAccount,
        to: IpScoreAddress,
        data:ip_contract.methods.registerIP(category,name,description,owner,md5,timestamp).encodeABI(),
        gas: 3000000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, ManagerPrivateKey);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

async function getIP(id) {
    const value = await ip_contract.methods.getIP(id).call();
    return value;
}

async function getPrice(id) {
    const value = await t_contract.methods.prices(id).call();
    return value;
}


async function getBalance() {
    const value = await ip_contract.methods.getBalance().call();
    return value;
}

async function setTransaction() {
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const tx = {
        from: ManagerAccount,
        to: IpScoreAddress,
        data: ip_contract.methods.setTransaction(Txaddress).encodeABI(),
        gas: 3000000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, ManagerPrivateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

async function setIPCore() {
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const tx = {
        from: ManagerAccount,
        to: Txaddress,
        data: t_contract.methods.setIPcore(IpScoreAddress).encodeABI(),
        gas: 3000000,
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
        to: IpScoreAddress,
        data: ip_contract.methods.invalidateIP(id).encodeABI(),
        gas: 3000000,
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
        to: IpScoreAddress,
        data:ip_contract.methods.restoreIP(id).encodeABI(),
        gas: 3000000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, ManagerPrivateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

async function sellIP(id,price,address,privKey) {
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const tx = {
        from: address,
        to: IpScoreAddress,
        data:ip_contract.methods.sellIP(id,price).encodeABI(),
        gas: 3000000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, privKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

async function withdrawIP(id,address,privKey) {
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const tx = {
        from: address,
        to: IpScoreAddress,
        data:ip_contract.methods.withdrawIP(id).encodeABI(),
        gas: 3000000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, privKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

async function transfer(id, price, address, privKey) {
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const valueInWei = web3.utils.toWei(price.toString(), 'gwei');
    const tx = {
        from: address,
        to: IpScoreAddress,
        data:ip_contract.methods.transfer(id).encodeABI(),
        value: ToHex(valueInWei),
        gas: 3000000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, privKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}



async function leaseIP(id,price,leaseEndTimestamp,address,privKey) {
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const tx = {
        from: address,
        to: IpScoreAddress,
        data:ip_contract.methods.sellIP(id,price,leaseEndTimestamp).encodeABI(),
        gas: 300000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, privKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

async function recycleIP(id,address,privKey) {
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const tx = {
        from: address,
        to: IpScoreAddress,
        data:ip_contract.methods.recycleIP(id).encodeABI(),
        gas: 3000000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, privKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

async function lease(id, price, address, privKey) {
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const valueInWei = web3.utils.toWei(price.toString(), 'gwei');
    const tx = {
        from: address,
        to: IpScoreAddress,
        data:ip_contract.methods.transfer(id).encodeABI(),
        value: ToHex(valueInWei),
        gas: 3000000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, privKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}


async function payContract(Gwei){
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('3', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    const valueInWei = web3.utils.toWei(Gwei.toString(), 'gwei');
    const value =ToHex(valueInWei);
    // Build Transaction Object
    const tx = {
        from: ManagerAccount,
        to: IpScoreAddress,
        value: value,
        gas: 3000000,
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, ManagerPrivateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

function ToHex(decimal) {
    const bigIntValue = BigInt(decimal);
    const hexValue = bigIntValue.toString(16);
    return `0x${hexValue}`;
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
                    restoreIP,setIPCore,setTransaction,getIP,getBalance,
                    sellIP,withdrawIP ,transfer,leaseIP,recycleIP,lease,payContract,openReadline,
                    getPrice
                
                };
