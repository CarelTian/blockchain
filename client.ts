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
    const address= await ask('Input your address: ');
    const category= await ask('Input your category: ');
    const path= await ask('Input your IP path: ');
    const name= await ask('Input your IP name: ');
    const des =await ask('Any describes?: ');
    const sql = 'INSERT INTO waitlist(address,category,filename,name,des) VALUES (?,?,?,?,?)';
    let db=creatDB();
    db.query(sql,[address,category,path,name,des,(err,result)=>{
        if (err) {
            console.error('Insert error: ', err);
            return;
        }
    }])
    closeDB(db);
    closeReadline();
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

async function transfer(id,price) {
    const ret=await utils.transfer(id,price);
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
program.parse(process.argv);
