const {Web3} = require('web3');
const fs = require('fs');
const path = require('path');
const BN=require('bn.js');
// 连接到以太坊节点（例如 Infura 或本地节点）
const infuraProjectId = 'b85b1201536841b19484f5f3917bcbc3';
const sepoliaUrl = `https://sepolia.infura.io/v3/${infuraProjectId}`;

const web3 = new Web3(sepoliaUrl);

// 获取账户和私钥
const account = '0x72555AC195E65b8448674cf4333b33B5EC0617B1';
const privateKey = 'f69d4f20895da23b6aa689df9d92348ffeb5b24fdb7905d13966fec678646499';

// 读取 ABI 和字节码
const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, './build/IPcore.abi'), 'utf8'));
const bytecode = fs.readFileSync(path.resolve(__dirname, './build/IPcore.bin'), 'utf8');

const deploy = async () => {
    // 创建合约实例
    const contract = new web3.eth.Contract(abi);

    // 构建部署交易
    const deployTx = contract.deploy({ data: bytecode });

    // 获取 Gas 估算
    const gas = await deployTx.estimateGas()+BigInt(30000);
    const latestBlock = await web3.eth.getBlock('latest');
    const baseFeePerGas = new BN(latestBlock.baseFeePerGas)
    const maxPriorityFeePerGas = new BN(web3.utils.toWei('50', 'gwei'));
    const maxFeePerGas =baseFeePerGas.add(maxPriorityFeePerGas);
    // 构建交易对象
    const tx = {
        from: account,
        gas: gas,
        data: deployTx.encodeABI(),
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),

    };

    // 签署交易
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    // 发送交易
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log('Contract deployed at address:', receipt.contractAddress);
};

deploy();  //0x2711d239fa29be265996716aad5feeca2cf5a80e
