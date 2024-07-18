/**
 * @fileoverview Description of the file's purpose
 * @author Reynor Lou
 * @version 1.1.0
 * @date 2024-7-18
 */

const {Web3} = require('web3');
const fs = require('fs');
const path = require('path');
const BN=require('bn.js');
const {creatDB,closeDB}=require('./db.ts');
const utils=require('./utils.ts');
const { Command } = require('commander');
const program = new Command();
require('dotenv').config({ path: './config.env' });


console.log('-------------------- Intellectual property rights management----------------------')

async function applyIP(){
    const rl=utils.openReadline();
    const address= await utils.ask('Input your address: ',rl);
    const category= await utils.ask('Input your category: ',rl);
    const path= await utils.ask('Input your IP path: ',rl);
    const name= await utils.ask('Input your IP name: ',rl);
    const des =await utils.ask('Any describes?: ',rl);
    const sql = 'INSERT INTO waitlist(address,category,filename,name,des) VALUES (?,?,?,?,?)';
    let db=creatDB();
    db.query(sql,[address,category,path,name,des,(err,result)=>{
        if (err) {
            console.error('Insert error: ', err);
            return;
        }
    }])
    closeDB(db);
    utils.closeReadline(rl);
    console.log("Submit to waitlist successfully")
}

async function sell_(id,price) {
    const ret=await utils.sellIP(id,price);
    console.log(ret);
}
async function withdraw_(id) {
    const ret=await utils.withdraw(id);
    console.log(ret);
}
async function getIP_(id) {
    const ret=await utils.getIP(id);
    console.log(ret);
}

async function buy_(id,price) {
    const ret=await utils.transfer(id,price);
    console.log(ret);
}

async function getPrice_(id) {
    const ret=await utils.getPrice(id);
    console.log(ret);
}


program
    .command('applyIP')
    .description('Execute applyIP')
    .action(applyIP);
program
    .command('getIP <id>')
    .description('get IP')
    .action(getIP_);
program
    .command('sell <id> <price>')
    .description('sell IP')
    .action(sell_);
program
    .command('withdraw <id>')
    .description('withdraw IP')
    .action(withdraw_);
program
    .command('buy <id> <price>')
    .description('buy IP')
    .action(buy_);
program
    .command('getPrice <id>')
    .description('buy IP')
    .action(getPrice_);
program.parse(process.argv);
